<?php

namespace App\Http\Controllers;

use Auth;
use Log;
use Validator;
use App\Song;
use App\Vote;
use App\Order;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class VoteController extends Controller
{

    public static $stuId;
    public $texts = [-10 => '非常不合适', -5 => '不合适', 0 => '中立', 5 => '合适', 10 => '非常合适'];
    public $points = [1 => -10, 2 => -5, 3 => 0, 4 => 5, 5 => 10];
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
        if (! config('music.openVote')) {
            return response()->json(['error' => 1, 'msg' => '投票已关闭']);
        }
        $validator = Validator::make($request->all(), [
            'id' => 'required | exists:songs',
            'vote' => [
                'required',
                Rule::in([1, 2, 3, 4, 5])
            ]
        ], self::$messages);
        if ($validator->fails()) {
            return response()->json(['error' => 1, 'msg' => $validator->errors()->first()]);
        }

        $vote = Vote::updateOrCreate(
            ['song_id' => $request->input('id'), 'voter' => self::$stuId],
            ['vote' => $this->points[$request->input('vote')]]
        );
        Log::info('Vote: ', ['voter' => self::$stuId, 'song' => $request->input('id'), 'vote' => $request->input('vote')]);
        return response()->json(['error' => 0]);
    }

    public function getSongs(Request $request)
    {
        if (! config('music.openVote')) {
            return response()->json(['error' => 1, 'msg' => '投票已关闭']);
        }
        $validator = Validator::make($request->all(), [
            'time' => [
                'required',
                Rule::in(['1', '2', '3', '4', '5', '6'])
            ]
        ], ['required' => '请选择时段', 'in' => '参数错误，请刷新重试']);
        if ($validator->fails()) {
            return response()->json(['error' => 1, 'msg' => $validator->errors()->first()]);
        }

        // 为减少一条SQL查询所以不用firstOrCreate
        $order = Order::find(self::$stuId);
        if (empty($order)) {
            $order = Order::create([
                'user_id' => self::$stuId,
                'order' => Song::select('id')->inRandomOrder()->get()]);
            $order->save();
        }
        $songs = Song::with(['votes' => function($query) {
            $query->where('voter', self::$stuId);
        }, 'file'])->select('id', 'file_id')->ofTime($request->input('time'))->whereIn('id', $order->order)->get();

        $order = array_flip($order->order); // 翻转数组以便使用sortBy
        // 由于数据库返回是按id递增排序,故需要重新按固定顺序排序
        $songs = $songs->sortBy(function ($song) use ($order) {
            return $order[$song['id']];
        });
        // Ugly Solution
        $id = 0;
        $songs = $songs->mapWithKeys(function ($song, $id) {
            $vote = $song->votes->first();
            if (empty($vote)) {
                $vote = '未投票';
            } else {
                $vote = $this->texts[$vote->vote];
            }
            $id++;
            return [
                $id => [
                    'id' => $song->id,
                    'url' => $song->file->url,
                    'vote' => $vote
                ]
            ];
        });
        return response()->json(['error' => 0, 'songs' =>$songs]);
    }
}
