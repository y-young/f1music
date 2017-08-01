<?php

namespace App\Http\Controllers;

use Log;
use Auth;
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

class DataController extends Controller
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
            $id = 0;
            $songs = $musicList->mapWithKeys(function ($song, $id) {
                $vote = $song->votes->where('voter', Auth::user()->stuId)->first();
                if(empty($vote))
                    $vote = '未投票';
                else {
                    switch ($vote->vote) {
                        case '-10':
                            $vote = '非常不合适';
                            break;
                        case '-5':
                            $vote = '不合适';
                            break;
                        case '5':
                            $vote = '合适';
                            break;
                        case '10':
                            $vote = '非常合适';
                            break;
                    }
                }
                $id++;
                return [
                    $id => [
                        'id' => $song->id,
                        'url' => $song->file->url(),
                        'vote' => $vote
                    ]
                ];
            });
            return response()->json(['error' => 0, 'songs' =>$songs]);
    }

    public static function Songs(Request $request) {
        $songs = Song::all();
        return response()->json(['error' => 0, 'songs' => $songs]);
    }

    public function Log() {
        return Storage::disk('log')->get('lumen.log');
    }

    public function Rank(Request $request) {
        $songs = Song::withCount('votes')->get();
        $list = collection([]);
        $songs = $songs->mapWithKeys(function($song) {
            $score = $song->votes_count == 0 ? 0 : $song->vote_sum / $song->votes_count;
var_export($score);
            return [[$song->id => $score]];
        });
        var_export($songs);
        //return response()->json(['error' => 0, 'songs' => ]);
    }
}
