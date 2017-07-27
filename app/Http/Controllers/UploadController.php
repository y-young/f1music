<?php
namespace App\Http\Controllers;
use Log;
use Validator;
use App\File;
use App\Song;
use App\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;
require_once(Config::get('music.apppath').'/Http/Controllers/getid3/getid3.php');
require_once(Config::get('music.apppath').'/Http/Controllers/getid3/write.php');

class UploadController extends Controller
{

    public static $messages = [
        'time.required' => '请选择时段',
        'time.in' => '参数错误,请重新选择时段',
        'name.required' => '请填写曲名',
        'string' => ':attribute 应为文本格式',
        'songUrl.url' => '云音乐地址应为URL格式',
        'songUrl.required_without' => '参数错误,请重新搜索音乐',
        'file.required_without' => '请上传一个文件',
        'file.max' => '禁止上传超过20MB的文件',
        'file.min' => '为保证音乐质量,请上传一个至少1MB的文件',
        'file.mimetypes' => '不允许上传此类型文件'  
    ];

    public static $errorMsg = [
        'stop_upload' => '文件上传已关闭',
        'time_too_long' => '您所上传的歌曲超过了6分钟，请选择短一些的曲目',
        'time_too_short' => '您所上传的歌曲还不到2分半钟，请选择长一些的曲目',
        'already_exists' => '您所上传的音乐在该时段已经有人推荐'
    ];

    public static $options = array(
        'min_file_size' => 1048576,
        'max_file_size' => 20*1048576,
        'accept_file_types' => '/\.(ogg|mp3)$/i',
    );

    public static $stuId;

    public static function Upload(Request $request)
    {
        self::$stuId = AuthController::checkLogin();
        Log::info('Requests: '.var_export($request->all(),true));
        if(!Config::get('music.openUpload'))
            return response()->json(['error' => 1, 'msg' => self::$errorMsg['stop_upload']]);
        $validator = Validator::make($request->all(), [
            'time' => [
                'required',
                Rule::in(['1', '2', '3', '4', '5', '6'])
            ],
            'name' => 'required | string',
            'origin' => 'nullable | string',
            // 'songUrl' => 'required_without: file | url',
            'file' => 'required_without:songUrl | file | min: 1024 | max: 20480'
        ], self::$messages);
        if($validator->fails())
            return response()->json(['error' => 1, 'msg' => $validator->errors()->first()]);

        $tmpDir = storage_path('app/tmp/');
        if($request->hasFile('file')) { //Manual Upload
            $reqFile = $request->file('file');
            $uFile = new UnvalidatedFile();
            $uFile->name = $reqFile->getClientOriginalName();
            $uFile->size = $reqFile->getClientSize();
            $uFile->time = $request->input('time');
            $uFile->songName = $request->input('name');
            $uFile->songOrigin = $request->input('origin');
            $uFile->url = $tmpDir.$uFile->name;

            $reqFile->move($tmpDir, $uFile->name); //先存储到临时目录以便验证
            $vFile = self::validateFile($uFile);
            Log::info('Files: '.var_export($vFile,true));
            if(empty($vFile->error)) {
                $vFile = self::store($vFile);
                self::insert($vFile);
            }
            else
                return response()->json(['error' => 1, 'msg' => $vFile->error]);
            return response()->json(['error' => 0]);
        }
    }

    public static function validateFile($file) {
        $file->error = null;
        $file->md5 = md5_file($file->url);
        $file->storageName = $file->md5.'.mp3';

        if(File::where('md5', $file->md5)->exists()) {
            $file->id = File::where('md5', $file->md5)->first()->id; //文件已上传过,获取ID
            if(Song::where([
                    ['playtime', '=', $file->time],
                    ['file', '=', $file->id]
                ])->exists())
                $file->error = self::$errorMsg['already_exists']; //音乐在该时段已经有人推荐
            //else 文件已经上传该时段但还未有人推荐,则直接使用,无需验证
        } else { //文件未上传过,则进行验证
            // 初始化文件处理
            $getID3 = new \getID3;
            $getID3->option_tag_id3v1 = false;
            $getID3->option_tag_id3v2 = false;
            $getID3->option_tag_lyrics3 = false;
            $getID3->option_tag_apetag = false;
            $getID3->option_md5_data = true;
            $mp3_info = $getID3->analyze($file->url);
            // Log::info('Mp3:'.var_export($mp3_info,true));
            $file->playtime = intval(round($mp3_info['playtime_seconds']));
            if($file->playtime < 2.5 * 60)
                $file->error = self::$errorMsg['time_too_short'];
            elseif ($file->playtime > 6 * 60)
                $file->error = self::$errorMsg['time_too_long'];
        }
        return $file;
    }

    public static function insert($file) {
        $song = Song::create([
                    'playtime' => $file->time,
                    'name' => $file->songName,
                    'origin' => $file->songOrigin,
                    'uploader' => self::$stuId,
                    'file' => $file->id
                ]);
        $song->save();
    }

    public static function store($vFile) {
        if(empty($vFile->id)) { //未上传过则存储
            //消除标签信息
            $writer = new \getid3_writetags;
            $writer->filename = $vFile->url;
            $writer->overwrite_tags = true;
            $writer->remove_other_tags = true;
            $writer->WriteTags();
            Storage::move('tmp/'.$vFile->name, 'uploads/'.$vFile->storageName);
            $file = File::create([
                    'md5' => $vFile->md5,
                    'uploader' => self::$stuId
                    ]);
            $file->save();
            $vFile->id = $file->id;
        }
        return $vFile;
    }

}

class UnvalidatedFile
{
    public $id = null;
    public $name = null;
    public $size = 0;
    public $type = null;
    public $time = null;
    public $songName = null;
    public $songOrigin = null;
    public $url = null;
}
