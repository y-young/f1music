<?php

namespace App\Http\Controllers;

use Log;
use Auth;
use Validator;
use App\File;
use App\Song;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
require_once(config('music.apppath').'/Http/Controllers/getid3/getid3.php');
require_once(config('music.apppath').'/Http/Controllers/getid3/write.php');

class UploadController extends Controller
{

    public static $messages = [
        'time.required' => '请选择时段',
        'time.in' => '参数错误,请重新选择时段',
        'name.required' => '请填写曲名',
        'name.size' => '歌曲名称不得超过30个字符'，
        'origin.size' => '歌曲来源不得超过50个字符'
        'string' => ':attribute 应为文本',
        'url.required_without' => '参数错误,请重新搜索音乐',
        'url.url' => '云音乐地址应为URL格式',
        'url.regex' => '不是合法的云音乐URL地址',
        'file.required_without' => '请上传一个文件',
        'file.file' => '上传的文件无效,请重新上传',
        'file.max' => '禁止上传超过20MB的文件',
        'file.min' => '为保证音乐质量,请上传一个至少1MB的文件',
        'file.mimetypes' => '只能上传MP3格式的文件'  
    ];

    public static $errorMsg = [
        'stop_upload' => '文件上传已关闭',
        'max_upload_num' => '上传数目已达到限定数码,感谢您对校园音乐的支持',
        'time_too_long' => '歌曲时长超过了6分钟,请选择短一些的曲目',
        'time_too_short' => '歌曲时长还不足2分半钟，请选择长一些的曲目',
        'already_exists' => '所上传的音乐在该时段已经有人推荐'
    ];
    public static $stuId;

    public function __construct(Request $request)
    {
        self::$stuId = Auth::user()->stuId;
    }

    public static function Upload(Request $request)
    {
        Log::info('Requests: '.var_export($request->all(),true));
        if (! config('music.openUpload')) {
            return response()->json(['error' => 1, 'msg' => self::$errorMsg['max_upload_num']]);
        } elseif (Song::where('uploader', self::$stuId)->count() >= 10) {
            return response()->json(['error' => 1, 'msg' => self::$errorMsg['stop_upload']]);
        }
        $validator = Validator::make($request->all(), [
            'time' => [
                'required',
                Rule::in(['1', '2', '3', '4', '5', '6'])
            ],
            'name' => 'required | string | max: 30',
            'origin' => 'nullable | string | max: 50',
            'url' => ['required_without:file', 'url', 'regex:/^((https|http)?:\/\/)(m[0-9].music.126.net)[^\s]+(.mp3)/'],
            'file' => ['required_without:url', 'file', 'mimetypes:audio/mpeg', 'min: 1024', 'max: 20480']
            //mp3的MIMEType是audio/mpeg,要使用mimes得写mpga
        ], self::$messages);
        if ($validator->fails()) {
            return response()->json(['error' => 1, 'msg' => $validator->errors()->first()]);
        }

        $t1 = microtime(true);
        // $uFile => Unvalidated File
        $uFile = self::getFileFromRequest($request);
        $t2 = microtime(true);
        Log::debug('Fetching:'.round($t2-$t1, 3));
        // $vFile => Validated File
        $vFile = self::validateFile($uFile);
        $t3 = microtime(true);
        Log::debug('Validation:'.round($t3-$t2, 3));
        Log::info('Files: '.var_export($vFile,true));

        if (empty($vFile->error)) {
            $vFile = self::store($vFile);
            self::insert($vFile);
        } else {
            Storage::disk('tmp')->delete($vFile->name);
            return response()->json(['error' => 1, 'msg' => $vFile->error]);
        }
        $t4 = microtime(true);
        Log::debug('Storing:'.round($t4-$t3, 3));
        Log::debug('Total:'.round($t4-$t1, 3));
        return response()->json(['error' => 0]);
    }

    public static function getFileFromRequest(Request $request)
    {
        $tmpDir = storage_path('app/tmp/');
        $file = new UnvalidatedFile();
        $file->time = $request->input('time');
        $file->songName = $request->input('name');
        $file->songOrigin = $request->input('origin');

        if ($request->hasFile('file')) { //Manual Upload
            $reqFile = $request->file('file');
            $file->name = $reqFile->getClientOriginalName();
            $file->url = $tmpDir.$file->name;
            $reqFile->move($tmpDir, $file->name); //先存储到临时目录以便验证
            $file->md5 = md5_file($file->url);
        } else { //Cloud Music Upload
            //TODO: 检查Mp3文件是否可用
            $file->name = explode('/', $request->input('url'))[9];
            $file->md5 = substr($file->name, 0, -4);
            Storage::disk('tmp')->put($file->name, file_get_contents($request->input('url')));
            $file->url = $tmpDir.$file->name;
        }
        return $file;
    }

    public static function validateFile($file)
    {
        $file->error = null;
        $file->storageName = $file->md5.'.mp3';

        if (File::where('md5', $file->md5)->exists()) {
            $file->id = File::where('md5', $file->md5)->first()->id; //文件已上传过,获取ID
            if (Song::ofTime($file->time)->where('file_id', $file->id)->exists()) {
                $file->error = self::$errorMsg['already_exists']; //音乐在该时段已经有人推荐
            } else {
                //文件已经上传该时段但还未有人推荐,则直接使用,无需验证
                Storage::disk('tmp')->delete($file->name);
            }
        } else { //文件未上传过,则进行验证
            $file->duration = self::getDuration($file);
            if ($file->duration < 2.5 * 60) {
                $file->error = self::$errorMsg['time_too_short'];
            } elseif ($file->duration > 6 * 60) {
                $file->error = self::$errorMsg['time_too_long'];
            }
        }
        return $file;
    }

    public static function getDuration($file)
    {
        $getID3 = new \getID3;
        $getID3->option_tag_id3v1 = false;
        $getID3->option_tag_id3v2 = false;
        $getID3->option_tag_lyrics3 = false;
        $getID3->option_tag_apetag = false;
        $getID3->option_md5_data = true;
        $mp3Info = $getID3->analyze($file->url);
        return intval(round($mp3Info['playtime_seconds']));
    }

    public static function insert($file)
    {
        $song = Song::create([
            'playtime' => $file->time,
            'name' => $file->songName,
            'origin' => $file->songOrigin,
            'uploader' => self::$stuId,
            'file_id' => $file->id
        ]);
        $song->save();
    }

    public static function store($vFile)
    {
        if (empty($vFile->id)) { //未上传过则存储
            self::removeTags($vFile);
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

    public static function removeTags($file)
    {
        $writer = new \getid3_writetags;
        $writer->filename = $file->url;
        $writer->overwrite_tags = true;
        $writer->remove_other_tags = true;
        $writer->WriteTags();
    }

    public static function curlGet($url)
    {
        $ch = curl_init();
		    curl_setopt($ch, CURLOPT_URL, $url);
		    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		    $output = curl_exec($ch);
        if (curl_errno($ch)) {
            return false;
        }
        curl_close($ch);
        return $output;
    }
}

class UnvalidatedFile
{
    public $id = null;
    public $name = null;
    public $time = null;
    public $songName = null;
    public $songOrigin = null;
    public $url = null;
}
