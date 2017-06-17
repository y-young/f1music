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

    public static function getList($type = null)
{
    if(empty($type))
        $musicList = Cache::remember('musiclist',30,function() {
            return DB::table('music')->get();
         });
    elseif($type < 1 || $type > 6)
        return response()->json(['error' => 1,'msg' => '类别不正确']);
    else
        $musicList = Cache::remember('musiclist'.$type,30,function () use ($type) {
            $files = DB::table('music')->select(DB::raw('`id`,`file`'))->where('type', $type)->get();
            return $files;
        });
    return response()->json(['error' => 0,'files' =>$musicList]);
  }

    public static function getListAdmin(Request $request)
{
    if(Cache::has('musiclist'.$request->input('type')))
        $musicList = Cache::get('musiclist'.$request->input('type'));
    else
        $musicList = DB::table('music')->pluck('file');
    return response()->json(['error' => 0,'files' =>$musicList]);
  }

    public static function Log()
{
    $contents = Storage::disk('log')->get('lumen.log');
   // Storage::disk('local')->put('file.txt', 'Contents');
    return $contents;
  }
}
