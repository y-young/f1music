<?php
namespace App\Http\Controllers;
use App\Http\Response;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;

class ListController extends Controller
{

    public static $stuId;

    public function _construct() {
        self::$stuId = AuthController::getStuId();
  }

    public static function getList($id = null) {
        $files = ListController::List($type);
        return response()->json(['error' => 0,'files' =>$musicList]);
  }

    public static function Vote(Request $request) {
        if($request->has('id') && $request->has('vote')) {
            $vote = intval($request->input('vote'));
            if(!in_array($vote, array(-10, -5, 5, 10)))
                return response()->json(['error' => 1, 'msg' => '参数错误']);
            if(DB::table('rank')->where([
                [ 'id', '=', $id ],
                ['stu_id', '=', $stuid]
            ])->exist()) {
                DB::update('UPDATE `rank` SET `rank`= ? WHERE `id`= ? AND `stu_id`= ?',[ $vote, $request->input('id'), self::$stuId ]);
             } else {
                DB::table('rank')->insert(
                    [ 'id' => $request->input('id'), 'stu_id' => self::$stuId, 'rank' => $vote ]
                );
            }
      }
  }

}
