<?php

namespace App\Http\Controllers;

use Log;
use Auth;
use App\File;
use App\Song;
use App\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ManageController extends Controller
{
    public function getStatus($type) {
        switch($type) {
            case 'home':
                return $this->success('status', config('music.status'));
            case 'upload':
                return $this->success('status', config('music.status.upload'));
            case 'vote':
                return $this->success('status', config('music.status.vote'));
            default:
                return $this->error("参数错误");
        }
    }
    public function getSongs()
    {
        $songs = Song::with('file')->withCount('reports')->get();
        return $this->success('songs', $songs);
    }

    public function viewSong($id)
    {
        $song = Song::with('reports', 'file')->where('id', $id)->first();
        return $this->success('song', $song);
    }

    public function editSong(Request $request)
    {
        $song = Song::withTrashed()->find($request->input('id'));
        $file = $song->file_id;
        $time = $request->input('playtime');
        $song->name = $request->input('name');
        $song->origin = $request->input('origin');
        if ($time != $song->playtime) {
            if (config('music.openVote') && env('APP_ENV', 'production') == 'production') {
                return $this->error('开放投票期间禁止修改曲目所在时段');
            }
            if (Song::withTrashed()->ofTime($time)->where('file_id', $file)->exists()) {
                return $this->error('曲目已存在于目标时段');
            }
            if($time == '3' && $song->file->duration > 5 * 60) {
                return $this->error('午出门铃声时长不得超过5分钟');
            }
        } else {
            $song->playtime = $time;
            $song->save();
        }
        return $this->success();
    }

    public function trashSongs(Request $request)
    {
        if (config('music.openVote') && env('APP_ENV', 'production') == 'production') {
            return $this->error('开放投票期间禁止删除曲目');
        }
        $operator = Auth::user()->stuId;
        foreach ($request->input('id') as $id) {
            Song::destroy($id);
            Log::info('Song ' . $id . ' trashed by ' . $operator);
        }
        return $this->success();
    }

    public function getTrashedSongs()
    {
        $songs =  Song::onlyTrashed()->with('file')->withCount('reports')->get();
        return $this->success('songs', $songs);
    }

    public function restoreSongs(Request $request)
    {
        $operator = Auth::user()->stuId;
        foreach ($request->input('id') as $id) {
            Song::withTrashed()->where('id', $id)->restore();
            Log::info('Song ' . $id . ' restored by ' . $operator);
        }
        return $this->success();
    }

    public function deleteSongs(Request $request)
    {
        if (config('music.openUpload') && env('APP_ENV', 'production') == 'production') {
            return $this->error('开放上传期间禁止彻底删除曲目');
        }
        if (config('music.openVote') && env('APP_ENV', 'production') == 'production') {
            return $this->error('开放投票期间禁止删除曲目');
        }
        $operator = Auth::user()->stuId;
        foreach ($request->input('id') as $id) {
            $song = Song::withTrashed()->find($id);
            if (!empty($song) && $song->trashed()) {
                //必须用find而不能用where,否则无法触发事件,见文档
                foreach ($song->reports as $report) {
                    $report->delete();
                }
                $song->forceDelete();
                Log::info('Song ' . $id . ' deleted by ' . $operator);
            }
        }
        return $this->success();
    }

    public function getFiles()
    {
        $files = File::all();
        return $this->success('files', $files);
    }

    public function getReports()
    {
        $reports = Report::with('song.file')->get();
        return $this->success('reports', $reports);
    }

    public function deleteReports(Request $request)
    {
        foreach ($request->input('id') as $id) {
            Report::destroy($id);
        }
        return $this->success();
    }

    public function getRank(Request $request)
    {
        if (env('APP_ENV', 'production') == 'production' && (config('music.openUpload') || config('music.openVote'))) {
            return $this->error('开放上传或投票期间无法查看投票数据');
        }
        $songs = Song::with('votes', 'file')->withCount('votes')->get();
        foreach ($songs as $song) {
            $song->vote_sum = $song->votes->sum->vote;
            $song->score = $song->votes_count == 0 ? 0 : $song->vote_sum / $song->votes_count;
        }
        $songs = $songs->sortBy(function ($song) { //先按时段再按得分排序
            return $song->playtime . '-' . (1 - 0.1 * $song->score);
        }); // Ugly Solution
        $songs = $songs->map(function ($song) {
            return [
                'id' => $song->id,
                'playtime' => $song->playtime,
                'name' => $song->name,
                'origin' => $song->origin,
                'score' => $song->score,
                'sum' => $song->vote_sum,
                'counts' => $song->votes_count,
                'url' => $song->file->url
            ];
        });
        return $this->success('rank', $songs->values());
    }

    public function Analyze()
    {
        if (env('APP_ENV', 'production') == 'production' && (config('music.openUpload') || config('music.openVote'))) {
            return $this->error('开放上传或投票期间无法查看投票数据');
        }
        $songs = Song::with('votes')->withCount('votes')->get();
        foreach ($songs as $song) {
            $song->awful = $song->votes->where('vote', -10)->count();
            $song->bad = $song->votes->where('vote', -5)->count();
            $song->neutral = $song->votes->where('vote', 0)->count();
            $song->good = $song->votes->where('vote', 5)->count();
            $song->awesome = $song->votes->where('vote', 10)->count();
            $song->vote_sum = $song->votes->sum->vote;
            $song->score = $song->votes_count == 0 ? 0 : $song->vote_sum / $song->votes_count;
        }
        $songs = $songs->sortBy(function ($song) {
            return $song->playtime . '-' . (1 - 0.1 * $song->score);
        });
        $result = "";
        foreach ($songs as $song) {
            $result .= "<tr><td>" . $song->id . "</td><td>" . $song->playtime . "</td><td>" . $song->name . "</td><td>" . $song->origin . "</td><td>" . $song->awful . "</td><td>" . $song->bad . "</td><td>" . $song->neutral . "</td><td>" . $song->good . "</td><td>" . $song->awesome . "</td><td>" . $song->score . "</td><td>" . $song->vote_sum . "</td><td>" . $song->votes_count . "</td></tr>";
        };
        return "
        <html>
            <body>
                <table border=\"1\">
                    <tbody>
                        <tr>
                            <td>#</td>
                            <td>Time</td>
                            <td>Name</td>
                            <td>Origin</td>
                            <td>-10</td>
                            <td>-5</td>
                            <td>0</td>
                            <td>5</td>
                            <td>10</td>
                            <td>Score</td>
                            <td>Sum</td>
                            <td>Count</td>
                        </tr>
                        $result
                    </tbody>
                </table>
            </body>
        </html>";
    }

    public function Download($id)
    {
        $song = Song::find($id);
        if (empty($song)) {
            abort(404);
        }
        return response()->download('uploads/' . $song->file->md5 . '.mp3', $song->name . '.mp3');
    }

    public function Statistics()
    {
        date_default_timezone_set('Asia/Shanghai');
        $time = date('m-d H:i:s');
        $upload = config('music.openUpload');
        $vote = config('music.openVote');
        $songs = DB::table('songs')->count();
        $files = DB::table('files')->count();
        $uploaders = DB::table('songs')->select('user_id')->distinct()->get()->count();
        $votes = DB::table('votes')->count();
        $voters = DB::table('votes')->select('user_id')->distinct()->get()->count();
        $viewers = DB::table('orders')->count();
        return $this->success('data', [
            'time' => $time,
            'open_upload' => $upload,
            'open_vote' => $vote,
            'songs' => $songs,
            'files' => $files,
            'uploaders' => $uploaders,
            'votes' => $votes,
            'voters' => $voters,
            'viewers' => $viewers
        ]);
    }
}
