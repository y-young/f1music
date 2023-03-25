<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Song;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use getID3;
use Metowolf\Meting;
use getid3_writetags;

class UploadController extends Controller
{
    private const messages = [
        'time.required' => '请选择时段',
        'time.in' => '参数错误,请重新选择时段',
        'name.required' => '请填写曲名',
        'name.max' => '歌曲名称不得超过50个字符',
        'origin.max' => '歌曲来源不得超过50个字符',
        'id.required_without' => '参数错误,请重新搜索音乐',
        'file.required_without' => '请上传一个文件',
        'file.file' => '上传的文件无效,请重新上传',
        'file.max' => '禁止上传超过20MB的文件',
        'file.min' => '为保证音频质量,请上传一个至少1MB的文件',
        'file.mimetypes' => '文件非mp3格式,请上传mp3格式的文件'
    ];

    private const errorMsg = [
        'stop_upload' => '上传已关闭',
        'max_upload_num' => '上传曲目数已达到限定数目,感谢您的支持',
        'time_too_long' => '歌曲时长超过6分钟,请选择短一些的曲目',
        'time_too_long_3' => '午出门铃声时长不得大于5分钟',
        'time_too_short' => '歌曲时长不足2分半,请选择长一些的曲目',
        'already_exists' => '曲目在该时段已经有人推荐',
        'mp1_or_mp2' => '文件为mp1或mp2格式,请上传mp3格式的文件',
        'bitrate_too_low' => '音频比特率低于128kbps,请上传音质较高的文件'
    ];

    public function upload(Request $request)
    {
        if (!config('music.openUpload')) {
            return $this->error(self::errorMsg['stop_upload'], 2);
        } elseif (Song::withTrashed()->where('user_id', Auth::id())->count() >= 12) {
            return $this->error(self::errorMsg['max_upload_num']);
        }
        Log::info('Requests: ' . var_export($request->all(), true));
        Validator::make($request->all(), [
            'time' => [
                'required',
                Rule::in(['1', '2', '3', '4', '5', '6'])
            ],
            'name' => 'required | string | max: 100',
            'origin' => 'nullable | string | max: 200',
            'id' => ['required_without:file', 'numeric', 'integer', 'min:0'],
            'file' => ['required_without:id', 'file', 'mimetypes:application/octet-stream,audio/mpeg', 'min: 1024', 'max: 20480']
            //某些mp3文件的mimetype会被识别为application/octet-stream,此处临时放行,后面交由getID3验证
            //mp3的MIMEType是audio/mpeg,要使用mimes得写mpga
        ], self::messages)->validate();

        try {
            // $uFile => Unvalidated File
            $uFile = self::getFileFromRequest($request);
            // $vFile => Validated File
            $vFile = self::validateFile($uFile);
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }

        if (empty($vFile->error)) {
            $vFile = self::storeFile($vFile);
            self::insertSong($vFile);
        } else {
            Storage::disk('tmp')->delete($vFile->name);
            return $this->error($vFile->error);
        }
        return $this->success();
    }

    public function uploads()
    {
        if (!config('music.openUpload')) {
            return $this->error(self::errorMsg['stop_upload'], 2);
        }
        $songs = Song::withTrashed()->where('user_id', Auth::id())->get();
        $songs = $songs->map(function ($song) {
            return $song->only(['playtime', 'name', 'origin']);
        });
        return $this->success('songs', $songs);
    }

    private static function getFileFromRequest(Request $request)
    {
        $tmpDir = storage_path('app/tmp/');
        $file = new UnvalidatedFile();
        $file->time = $request->input('time');
        $file->songName = $request->input('name');
        $file->songOrigin = $request->input('origin');

        if ($request->hasFile('file')) { //Manual Upload
            $reqFile = $request->file('file');
            $file->name = $reqFile->getClientOriginalName();
            $file->url = $tmpDir . $file->name;
            $reqFile->move($tmpDir, $file->name); //先存储到临时目录以便验证
            $file->md5 = md5_file($file->url);
        } else { //Cloud Music Upload
            $url = self::getMp3($request->input('id'));
            $file->cloudId = $request->input('id');
            if (empty($url)) {
                throw new \Exception('暂不支持无版权或付费歌曲,请手动上传');
            }
            $pathInfo = pathinfo($url);
            $file->name = $pathInfo['basename'];
            $file->md5 = $pathInfo['filename'];
            Storage::disk('tmp')->put($file->name, file_get_contents($url));
            $file->url = $tmpDir . $file->name;
        }
        return $file;
    }

    private static function validateFile($file)
    {
        $file->error = null;
        $file->storageName = $file->md5 . '.mp3';
        $eFile = File::where('md5', $file->md5); //eFile->Existing File

        if ($eFile->exists()) {
            $file->id = $eFile->first()->id; //文件已上传过,获取ID
            $file->duration = $eFile->first()->duration;

            if (Song::withTrashed()->ofTime($file->time)->where('file_id', $file->id)->exists()) {
                $file->error = self::errorMsg['already_exists']; //音乐在该时段已经有人推荐
            } else {
                //文件已经上传该时段但还未有人推荐,则只需验证时长
                if ($file->time == '3') {
                    $file = self::checkDuration($file);
                }
                if (empty($file->error)) {
                    Storage::disk('tmp')->delete($file->name);
                } else {
                    return $file;
                }
            }
        } else { //文件未上传过,则进行验证
            $info = self::getInfo($file);
            $format = $info['format'];
            $duration = $info['duration'];
            $file->duration = $duration;

            if (in_array($format, ['mp1', 'mp2'])) {
                $file->error = self::errorMsg['mp1_or_mp2'];
            } elseif ($format != 'mp3') {
                $file->error = self::messages['file.mimetypes'];
            } elseif ($info['bitrate'] < 128000) {
                $file->error = self::errorMsg['bitrate_too_low'];
            }
            $file = self::checkDuration($file);
        }
        return $file;
    }

    private static function insertSong($file)
    {
        $song = Song::create([
            'playtime' => $file->time,
            'name' => $file->songName,
            'origin' => $file->songOrigin,
            'user_id' => Auth::id(),
            'file_id' => $file->id
        ]);
        $song->save();
    }

    private static function storeFile($vFile)
    {
        if (empty($vFile->id)) { //未上传过则存储
            self::removeTags($vFile);
            Storage::move('tmp/' . $vFile->name, 'uploads/' . $vFile->storageName);
            $file = File::create([
                'md5' => $vFile->md5,
                'duration' => $vFile->duration,
                'cloud_id' => $vFile->cloudId,
                'user_id' => Auth::id()
            ]);
            $file->save();
            $vFile->id = $file->id;
        }
        return $vFile;
    }

    private static function getInfo($file)
    {
        $getID3 = new getID3;
        $getID3->setOption([
            'option_tag_id3v1' => false,
            'option_tag_id3v2' => false,
            'option_tag_lyrics3' => false,
            'option_tag_apetag' => false,
            'option_md5_data' => false,
            'option_sha1_data' => false,
            'option_max_2gb_check' => false
        ]);

        $mp3Info = $getID3->analyze($file->url);
        if (!empty($mp3Info['error'])) {
            Log::info("Error: ", $mp3Info['error']);
            throw new \Exception('文件非mp3格式或已经损坏,请上传有效的mp3文件');
        }
        $info = [
            'format' => $mp3Info['fileformat'],
            'bitrate' => $mp3Info['bitrate'],
            'duration' => intval($mp3Info['playtime_seconds'])
        ];
        Log::info('Info:', $info);
        return $info;
    }

    private static function checkDuration($file)
    {
        if (!empty($file->error)) { //不覆盖已有错误信息
            return $file;
        }
        if ($file->duration < 2.5 * 60) {
            $file->error = self::errorMsg['time_too_short'];
            return $file;
        }
        if ($file->time == '3') {
            if ($file->duration > 5 * 60) {
                $file->error = self::errorMsg['time_too_long_3'];
            }
        } elseif ($file->duration > 6 * 60) {
            $file->error = self::errorMsg['time_too_long'];
        }
        return $file;
    }

    private static function removeTags($file)
    {
        $writer = new getid3_writetags;
        $writer->filename = $file->url;
        $writer->overwrite_tags = true;
        $writer->remove_other_tags = true;
        $writer->WriteTags();
    }

    private static function getMp3($id)
    {
        $api = new Meting('netease');
        $res = $api->format(false)->url($id, 128);
        $res = json_decode($res, true);
        $res = $res["data"][0];
        if ($res["freeTrialInfo"] == null) {
            $url = $res["url"];
        } else {
            $url = "";
        }
        return $url;
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
    public $cloudId = null;
    public $md5 = null;
}