<?php
namespace App\Http\Controllers;
use Log;
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
        1 => 'The uploaded file exceeds the upload_max_filesize directive in php.ini',
        2 => 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form',
        3 => '文件只上传了一部分',
        4 => '没有文件被上传',
        6 => '缺失临时目录',
        7 => '写入文件失败',
        8 => 'PHP 扩展阻止了文件上传',
        'post_max_size' => 'The uploaded file exceeds the post_max_size directive in php.ini',
        'max_file_size' => '不能上传超过20MB的文件',
        'min_file_size' => '为保证音乐质量,请上传一个至少1MB的文件',
        'accept_file_types' => '不允许上传此类型文件',
        'max_number_of_files' => '文件个数超出限制',
        'abort' => '文件上传被暂停',
        'stop_upload' => '文件上传已关闭',
        'time_too_long' => '您所上传的歌曲超过了6分钟，请选择短一些的曲目',
        'time_too_short' => '您所上传的歌曲还不到2分半钟，请选择长一些的曲目',
        'already_exists' => '您所上传的音乐已经存在，请确认您所上传的尚未有人推荐',
        'type_too_old' => '您所上传的可能是mp1或mp2文件'
    );

    public static $options = array(
        'min_file_size' => 1048576,
        'max_file_size' => 20*1048576,
        'accept_file_types' => '/\.(gif|ogg|mp3)$/i',
    );

    public static $stuId;

    public function _construct() {
        self::$stuId = AuthController::getStuId();
  }

    public static function Upload(Request $request)
    {
      $uploadDir = storage_path('app/tmp/');
      if($request->hasFile('files')) {
        $files = $request->file('files');
        $json = array( 'files' => array() );
  //      foreach( $files as $file ) {
            $file = $files[0];
            $file->name = $file->getClientOriginalName();
            $file->time = $request->input('time');
            $file->title = $request->input('title');
            $file->origin = $request->input('origin');
            $file->url = $uploadDir.$file->name;

            $json['files'][0] = array(
                'name' => $file->name,
                'size' => $file->getSize(),
                'type' => $file->getClientMimeType(),
                'url' => $file->url,
                'deleteType' => 'DELETE',
                'deleteUrl' => '/Delete/'.$file->name,
            //    'error' => $file->error
             );

             $upload = $file->move($uploadDir, $file->name );
             $file->size = Storage::disk('tmp')->size($file->name);
             $file = self::validateFile($file);
             Log::info('Files: '.var_export($file,true));
             if(empty($file->error))
                 self::store($file);
             else
                 $json['files'][0]['error'] = $file->error;
        // }
         return response()->json($json);
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
        elseif(!preg_match(self::$options['accept_file_types'], $file->getClientOriginalName()))
            $file->error = self::$errorMsg['accept_file_types'];
        elseif(self::$options['max_file_size'] && 
                $file->size > self::$options['max_file_size'])
            $error = self::$errorMsg['max_file_size'];
        elseif(self::$options['min_file_size'] && 
                $file->size < self::$options['min_file_size'])
            $file->error = self::$errorMsg['min_file_size'];
        elseif(empty($file->title))
            $file->error = "请输入歌曲名称";
        // 文件分析
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
  //      DB::statement('UNLOCK TABLES');
        //生成ID
    //    DB::statement('LOCK TABLES `music` WRITE');
        do {
            $id = mt_rand();
        } while (DB::table('music')->where('id', $id)->exists());

        // 插入数据库
        if (!DB::table('music')->where([
                  [ 'file', '=', $file->md5 ],
                  [ 'type', '=', $file->time ]
               ])->exists())
        {
        DB::table('music')->insert(
            [ 'id' => $id, 'file' => $file->md5, 'title' => $file->title, 'source' => $file->origin, 'original' => $file->name, 'type' => $file->time ]
        );
        DB::table('student')->insert(
            [ 'id' => self::$stuId, 'order' => $id ]
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
