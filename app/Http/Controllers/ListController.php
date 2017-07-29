<?php

namespace App\Http\Controllers;

use Log;
use Validator;
use App\File;
use App\Song;
use App\Vote;
use App\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

class ListController extends Controller
{

    public static function getList(Request $request) {
        if(!Config::get('music.openVote'))
            return response()->json(['error' => 0, 'songs' => []]);
        $validator = Validator::make($request->all(), [
            'time' => [
                'required',
                Rule::in(['1', '2', '3', '4', '5', '6'])
            ]
        ], ['required' => '请选择时段', 'in' => '参数错误，请刷新重试']);
        if($validator->fails())
            return response()->json(['error' => 1, 'msg' => $validator->errors()->first()]);

           /*$musicList = Cache::remember('musiclist'.$request->input('time'),30,function() use ($request) {
                $songs = Song::select('id')->where('playtime', $request->input('time'))->inRandomOrder()->get()->only(['id', 'file']);
               // Log::info(var_export($songs,true));
                return $songs;
            });*/
            $musicList = Song::select('id', 'file_id')->where('playtime', $request->input('time'))->inRandomOrder()->get();
            $songs = $musicList->mapWithKeys(function ($song) {
                $vote = $song->votes->where('voter', '***REMOVED***')->first();
                return [
                    $song['id'] => [
                        $song->file->url(),
                        empty($vote) ? 0 : $vote->vote
                    ]
                ];
            });
            return response()->json(['error' => 0, 'songs' =>$songs->all()]);
    }

    public static function adminList(Request $request) {
        if(Cache::has('musiclist'.$request->input('type')))
            $musicList = Cache::get('musiclist'.$request->input('type'));
        else
            $musicList = DB::table('music')->pluck('file');
        return response()->json(['error' => 0,'files' =>$musicList]);
    }

    public static function Log() {
        $contents = Storage::disk('log')->get('lumen.log');
    // Storage::disk('local')->put('file.txt', 'Contents');
        return $contents;
    }
}
