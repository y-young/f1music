<?php

namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Metowolf\Meting;

class MusicController extends Controller
{

    public static $API;

    public function __construct() {
        self::$API = new Meting('netease');
    }

    public function Search(Request $request) {
        $validator = Validator::make($request->all(), [
            'keyword' => 'required'
        ], ['required' => '请输入搜索词']);
        if($validator->fails())
            return response()->json(['error' => 1, 'msg' => $validator->errors()->first()]);
        return self::$API->format(true)->search($request->input('keyword'));
    }

    public function Mp3(Request $request) {
        $validator = Validator::make($request->all(), [
            'id' => 'required'
        ], ['required' => '参数错误,请刷新重试']);
        if($validator->fails())
            return response()->json(['error' => 1, 'msg' => $validator->errors()->first()]);
        $url = json_decode(self::$API->format(true)->url($request->input('id')))->url;
        if(empty($url))
            return response()->json(['error' => 1, 'msg' => '歌曲未找到']);
        return $url;
    }

    public function Playlist() {
        $res = json_decode(self::$API->format(true)->playlist(163809839), true);
        $res = array_map(function($song) {
            return [
                'title' => $song['name'],
                'author' => implode('', $song['artist']),
                'url' => json_decode(self::$API->format(true)->url($song['id']))->url,
                'pic' => json_decode(self::$API->format(true)->pic($song['pic_id']))->url
            ];
        }, $res);
        return json_encode($res);
    }
}
