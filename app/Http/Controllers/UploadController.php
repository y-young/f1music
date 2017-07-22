<?php
namespace App\Http\Controllers;
use Log;
use App\Song;
use App\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
require_once(Config::get('music.apppath').'/Http/Controllers/getid3/getid3.php');
require_once(Config::get('music.apppath').'/Http/Controllers/getid3/write.php');

class UploadController extends Controller
{

    public static $errorMsg = array(
        'max_file_size' => '不能上传超过20MB的文件',
        'min_file_size' => '为保证音乐质量,请上传一个至少1MB的文件',
        'accept_file_types' => '不允许上传此类型文件',
        'stop_upload' => '文件上传已关闭',
        'time_too_long' => '您所上传的歌曲超过了6分钟，请选择短一些的曲目',
        'time_too_short' => '您所上传的歌曲还不到2分半钟，请选择长一些的曲目',
        'already_exists' => '您所上传的音乐已经存在，请确认您所上传的尚未有人推荐',
    );

    public static $options = array(
        'min_file_size' => 1048576,
        'max_file_size' => 20*1048576,
        'accept_file_types' => '/\.(ogg|mp3)$/i',
    );

    public static $stuId;

    public function _construct() {
        self::$stuId = AuthController::getStuId();
    }

    public static function Upload(Request $request)
    {
        Log::info('Requests: '.var_export($request->all(),true));
        // if($request->file('file')->isValid())
        //   return response()->json(['error' => 0]);
        // else
        //   return response()->json(['error' => 1]);
        $uploadDir = storage_path('app/tmp/');
        if($request->hasFile('file')) {
            $reqFile = $request->file('file');
            $file = new File();
            $file->name = $reqFile->getClientOriginalName();
            $file->size = $reqFile->size;
            $file->time = $request->input('time');
            $file->songName = $request->input('name');
            $file->songOrigin = $request->input('origin');
            $file->url = $uploadDir.$file->name;

            $upload = $file->move($uploadDir, $file->name);
            // $file->size = Storage::disk('tmp')->size($file->name);
            $file = self::validateFile($file);
            Log::info('Files: '.var_export($file,true));
            if(empty($file->error))
                self::store($file);
            else
                return response()->json(['error' => 1, 'msg' => $file->error]);
            return response()->json(['error' => 0]);
        }
    }

    public static function validateFile($file) {
        $error = null;
        // 初始化文件处理
        $getID3 = new \getID3;
        $getID3->option_tag_id3v1 = false;
        $getID3->option_tag_id3v2 = false;
        $getID3->option_tag_lyrics3 = false;
        $getID3->option_tag_apetag = false;
        $getID3->option_md5_data = true;
        if(!Config::get('music.openUpload'))
            $file->error = self::$errorMsg['stop_upload'];
        elseif(!preg_match(self::$options['accept_file_types'], $file->name))
            $file->error = self::$errorMsg['accept_file_types'];
        elseif(self::$options['max_file_size'] && $file->size > self::$options['max_file_size'])
            $error = self::$errorMsg['max_file_size'];
        elseif(self::$options['min_file_size'] && $file->size < self::$options['min_file_size'])
            $file->error = self::$errorMsg['min_file_size'];
        elseif(empty($file->songName))
            $file->error = "请输入歌曲名称";
        // MP3分析
        else{
            $file->md5 = md5_file($file->url);
            $mp3_info = $getID3->analyze($file->url);
            //Log::info('Analytics:'.var_export($mp3_info,true));
            $fileformat = $mp3_info['fileformat'];
            //$md5 = $mp3_info['md5_data'];
            $file->storageName = $file->md5.'.mp3';
            $file->playtime = intval(round($mp3_info['playtime_seconds']));
            if (Storage::disk('public')->exists($file->storageName))
                $file->error = self::$errorMsg['already_exists'];
            elseif ($file->playtime < 2.5 * 60)
                $file->error = self::$errorMsg['time_too_short'];
            elseif ($file->playtime > 6 * 60)
                $file->error = self::$errorMsg['time_too_long'];
        }
        return $file;
    }

    public static function dbInsert($file) {
   //     DB::statement('LOCK TABLES `files` WRITE');
        if (!DB::table('files')->where('id', $file->md5)->exists())
        {
            DB::table('files')->insert(
                [ 'id' => $file->md5, 'playtime' => $file->playtime,  'filesize' => $file->size ]
            );
            DB::update('UPDATE `files` SET `time`=NOW() WHERE id= ?',[ $file->md5 ]);
        }
        //生成ID
        do {
            $id = rand(1, 100000);
        } while (App\Song::where('id', $id)->exists());

        // 插入数据库
        if (!DB::table('music')->where([
                  [ 'file', '=', $file->md5 ],
                  [ 'type', '=', $file->time ]
               ])->exists()) {
            DB::table('music')->insert(
            [ 'id' => $id, 'file' => $file->md5, 'title' => $file->title, 'source' => $file->origin, 'original' => $file->name, 'type' => $file->time ]
            );
  //      DB::statement('UNLOCK TABLES');
        DB::table('files')->increment('ref', 1, ['id' => $file->md5]);
        }
  }

    public static function store($file) {
        // 消除标签信息
        $writer = new \getid3_writetags;
        $writer->filename = $file->url;
        $writer->overwrite_tags = true;
        $writer->remove_other_tags = true;
        $writer->WriteTags();
        Storage::move('tmp/'.$file->name, 'uploads/'.$file->storageName);
        self::dbInsert($file);
  }

}

class File
{
    public static $name = null;
    public static $size = null;
    public static $type = null;
    public static $songName = null;
    public static $songOrigin = null;
    public static $url = null;
}