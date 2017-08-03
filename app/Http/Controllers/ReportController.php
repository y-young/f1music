<?php

namespace App\Http\Controllers;

use Auth;
use Validator;
use App\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public static $stuId;
    public static $messages = [
        'id.required' => '参数错误,请刷新重试',
        'id.exists' => '歌曲不存在,请刷新重试',
        'reason.required' => '请填写举报原因'
    ];

    public function __construct() {
        self::$stuId = Auth::user()->stuId;
    }

    public function Report(Request $request) {
        $validator = Validator::make($request->all(), [
            'id' => 'required | exists:songs',
            'reason' => 'required'
        ], self::$messages);
        if($validator->fails())
            return response()->json(['error' => 1, 'msg' => $validator->errors()->first()]);

        $report = Report::updateOrCreate(
            ['song_id' => $request->input('id'), 'reporter' => self::$stuId],
            ['reason' => $request->input('reason')]
        );
        $report->save();

        return response()->json(['error' => 0]);
    }
}
