<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Metowolf\Meting;

class MusicController extends Controller
{

    private static $api;

    public function __construct()
    {
        self::$api = new Meting('netease');
        // 网易常封cookies,必要时手动抓取music.163.com的cookies并更换
        //self::$api->cookie('');
    }

    public function search(Request $request)
    {
        Validator::make($request->all(), [
            'keyword' => 'required | string'
        ], ['required' => '请输入搜索词或粘贴链接'])->validate();

        $keyword = $request->input('keyword');
        // Try to match the keyword as a URL
        $re = '/^https?:\/\/(?:y\.)?music\.163\.com\/(?:[m#]\/)?(song|album|playlist)\?id=(\d+)/m';
        preg_match_all($re, $keyword, $matches, PREG_SET_ORDER, 0);

        $api = self::$api->format(true);
        if (!empty($matches)) {
            $type = $matches[0][1];
            $id = $matches[0][2];
            $result = match ($type) {
                "song" => $api->song($id),
                "album" => $api->album($id),
                "playlist" => $api->playlist($id),
                default => "[]"
            };
        } else {
            $result = $api->search($keyword);
        }

        $result = json_decode($result, true);
        if (empty($result)) {
            return $this->error('未能找到相关搜索结果');
        } else {
            return $this->success('result', $result);
        }
    }

    public function mp3(Request $request)
    {
        Validator::make($request->all(), [
            'id' => 'required | numeric | integer | min: 0'
        ], ['required' => '参数错误,请刷新重试'])->validate();

        $res = self::$api->format(false)->url($request->input('id'), 128);
        $res = json_decode($res, true);
        $url = "";
        $data = $res["data"][0] ?? [];
        $freeTrialInfo = array_key_exists("freeTrialInfo", $data) ? $data["freeTrialInfo"] : [];
        if ($freeTrialInfo === NULL) {
            $url = $data["url"] ?? "";
        }
        if (empty($url)) {
            return $this->error('暂无版权或歌曲未找到');
        }
        //$url = preg_replace('/(m\\d{1})c.music.126.net/', '$1.music.126.net', $url, 1); //m3c此类开头无法外链,故无法试听,改为m3即可
        return $this->success();
    }

    public function playlist()
    {
        $list = Cache::remember('playlist', 600, function () {
            $result = json_decode(self::$api->format(true)->playlist(config('music.playlist')), true);
            $list = array_map(
                function ($song) {
                    $url = json_decode(self::$api->format(true)->url($song['id']))->url;
                    $url = preg_replace('/(m\\d{1})c.music.126.net/', '$1.music.126.net', $url, 1);
                    return [
                        'title' => $song['name'],
                        'author' => implode('', $song['artist']),
                        'url' => $url,
                        'pic' => json_decode(self::$api->format(true)->pic($song['pic_id']))->url
                    ];
                }
                ,
                $result
            );
            return $list;
        });
        return response()->json($list);
    }
}