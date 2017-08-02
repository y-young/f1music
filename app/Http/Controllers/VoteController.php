<?php

namespace App\Http\Controllers;

use Auth;
use Validator;
use App\Song;
use App\Vote;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

class VoteController extends Controller
{

    public static $stuId;
    public $texts = ['-10' => '非常不合适', '-5' => '不合适', '0' => '中立', '5' => '合适', '10' => '非常合适'];
    public static $messages = [
        'id.required' => '参数错误,请刷新页面',
        'id.exists' => '参数错误,请刷新页面',
        'vote.required' => '请选择您的评价',
        'vote.in' => '参数错误,请重试'
    ];

    public function __construct(Request $request)
    {
        self::$stuId = Auth::user()->stuId;
    }

    public function Vote(Request $request)
    {
        if (!Config::get('music.openVote')) {
            return response()->json(['error' => 1, 'msg' => '投票已关闭']);
        }
        $validator = Validator::make($request->all(), [
            'id' => 'required | exists:songs',
            'vote' => [
                'required',
                Rule::in([-10, -5, 5, 10])
            ]
        ], self::$messages);
        if ($validator->fails()) {
            return response()->json(['error' => 1, 'msg' => $validator->errors()->first()]);
        }

        $vote = Vote::updateOrCreate(
            ['song_id' => $request->input('id'), 'voter' => self::$stuId],
            ['vote' => $request->input('vote')]
        );
        return response()->json(['error' => 0]);
    }

    public function List(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'time' => [
                'required',
                Rule::in(['1', '2', '3', '4', '5', '6'])
            ]
        ], ['required' => '请选择时段', 'in' => '参数错误，请刷新重试']);
        if ($validator->fails()) {
            return response()->json(['error' => 1, 'msg' => $validator->errors()->first()]);
        }

           /*$musicList = Cache::remember('musiclist'.$request->input('time'),30,function() use ($request) {
                $songs = Song::select('id')->where('playtime', $request->input('time'))->inRandomOrder()->get()->only(['id', 'file']);
               // Log::info(var_export($songs,true));
                return $songs;
            });*/
            $musicList = Song::select('id', 'file_id')->where('playtime', $request->input('time'))->inRandomOrder()->get();
            $id = 0;
            $songs = $musicList->mapWithKeys(function ($song, $id) {
                $vote = $song->votes->where('voter', Auth::user()->stuId)->first();
                if (empty($vote)) {
                    $vote = '未投票';
                } else {
                    $vote = $this->texts[$vote->vote];
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
}
