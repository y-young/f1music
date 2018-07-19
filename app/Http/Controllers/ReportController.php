<?php

namespace App\Http\Controllers;

use Auth;
use Validator;
use App\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    private static $stuId;
    private static $messages = [
        'id.required' => '参数错误,请刷新重试',
        'id.exists' => '歌曲不存在,请刷新重试',
        'reason.required' => '请填写举报原因',
        'reason.max' => '举报原因不得超过50个字符'
    ];

    public function __construct()
    {
        self::$stuId = Auth::user()->stuId;
    }

    public function Report(Request $request)
    {
        Validator::make($request->all(), [
            'id' => 'required | exists:songs',
            'reason' => 'required | string | max: 50'
        ], self::$messages)->validate();

        $report = Report::updateOrCreate(
            ['song_id' => $request->input('id'), 'user_id' => self::$stuId],
            ['reason' => $request->input('reason')]
        );
        $report->save();

        return $this->success();
    }
}
