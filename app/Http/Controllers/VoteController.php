<?php

namespace App\Http\Controllers;

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

    public static $messages = [
        'id.required' => '参数错误,请刷新页面',
        'id.exists' => '参数错误,请刷新页面',
        'vote.required' => '请选择您的评价',
        'vote.in' => '参数错误,请重试'
    ];

    public function __construct(Request $request) {
        self::$stuId = AuthController::checkLogin($request);
    }

    public function Vote(Request $request) {
        if(!Config::get('music.openVote')) {
            return response()->json(['error' => 1, 'msg' => '投票已关闭']);
        }
        $validator = Validator::make($request->all(), [
            'id' => 'required | exists:songs',
            'vote' => [
                'required',
                Rule::in([-10, -5, 5, 10])
            ]
        ], self::$messages);
        if($validator->fails())
            return response()->json(['error' => 1, 'msg' => $validator->errors()->first()]);

        $vote = Vote::updateOrCreate(
            ['song_id' => $request->input('id'), 'voter' => self::$stuId],
            ['vote' => $request->input('vote')]
        );
        return response()->json(['error' => 0]);
    }

}
