<?php

namespace App\Http\Controllers;

use App\Models\Song;
use App\Models\Vote;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class VoteController extends Controller
{
    private const stars = [-10 => 1, -5 => 2, 1 => 3, 5 => 4, 10 => 5];
    private const points = [1 => -10, 2 => -5, 3 => 1, 4 => 5, 5 => 10];
    private const messages = [
        'id.required' => '参数错误,请刷新页面',
        'id.exists' => '参数错误,请刷新页面',
        'vote.required' => '请选择您的评价',
        'vote.in' => '参数错误,请重试'
    ];

    public function vote(Request $request)
    {
        if (!config('music.openVote')) {
            return $this->error('投票未开放', 2);
        }
        Validator::make($request->all(), [
            'id' => 'required | exists:songs',
            'vote' => [
                'required',
                Rule::in([1, 2, 3, 4, 5])
            ]
        ], self::messages)->validate();

        $rate = self::points[$request->input('vote')];
        Vote::updateOrCreate(
            ['song_id' => $request->input('id'), 'user_id' => Auth::id()],
            ['vote' => $rate]
        );
        Log::info('Vote: ', ['user_id' => Auth::id(), 'song' => $request->input('id'), 'vote' => $rate]);
        return $this->success();
    }

    public function getSongs(Request $request)
    {
        if (!config('music.openVote')) {
            return $this->error('投票未开放', 2);
        }
        Validator::make($request->all(), [
            'time' => [
                'required',
                Rule::in(['1', '2', '3', '4', '5', '6'])
            ]
        ], ['required' => '请选择时段', 'in' => '参数错误，请刷新重试'])->validate();

        // 为减少一条SQL查询所以不用firstOrCreate
        $order = Order::find(Auth::id());
        if (empty($order)) {
            $order = Order::create([
                'user_id' => Auth::id(),
                'order' => Song::select('id')->inRandomOrder()->get()->pluck('id')
            ]);
            $order->save();
        }
        $songs = Song::with([
            'votes' => function ($query) {
                $query->where('user_id', Auth::id());
            },
            'file'
        ])->select('id', 'file_id')->ofTime($request->input('time'))->whereIn('id', $order->order)->get();

        $order = $order->order->flip(); // 翻转数组以便使用sortBy
        // 由于数据库返回是按id递增排序,故需要重新按固定顺序排序
        $songs = $songs->sortBy(function ($song) use ($order) {
            return $order[$song['id']];
        });
        // Ugly Solution
        $songs = $songs->mapWithKeys(function ($song) {
            static $id = 0;
            $vote = $song->votes->first();
            if (empty($vote)) {
                $vote = 0;
            } else {
                $vote = self::stars[$vote->vote];
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
        return $this->success('songs', $songs->values());
    }
}