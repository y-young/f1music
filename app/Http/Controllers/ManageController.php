<?php

namespace App\Http\Controllers;

use Log;
use Validator;
use App\File;
use App\Song;
use App\Vote;
use App\Report;
use App\Option;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ManageController extends Controller
{
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
        $song = Song::find($request->input('id'));
        $song->name = $request->input('name');
        $song->playtime = $request->input('playtime');
        $song->origin = $request->input('origin');
        $song->save();
        return $this->success();
    }

    public function trashSongs(Request $request)
    {
        if (config('music.openVote') && env('APP_ENV', 'production') == 'production') {
            return $this->error('开放投票期间禁止删除曲目');
        }
        foreach ($request->input('id') as $id) {
           Song::destroy($id);
        }
        return $this->success();
    }

    public function getTrashedSongs()
    {
        return $this->success('songs', Song::onlyTrashed()->with('file')->withCount('reports')->get());
    }

    public function restoreSongs(Request $request)
    {
        foreach ($request->input('id') as $id) {
            Song::withTrashed()->where('id', $id)->restore();
        }
        return $this->success();
    }

    public function deleteSongs(Request $request)
    {
        if (config('music.openVote') && env('APP_ENV', 'production') == 'production') {
            return $this->error('开放投票期间禁止删除曲目');
        }
        foreach ($request->input('id') as $id) {
            $song = Song::withTrashed()->find($id);
            if (! empty($song) && $song->trashed()) {
                //必须用find而不能用where,否则无法触发事件,见文档
                foreach ($song->reports as $report) {
                    $report->delete();
                }
                $song->forceDelete();
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
        $songs = Song::with('votes', 'file')->withCount('votes')->get();
        foreach ($songs as $song) {
            $song->vote_sum = $song->votes->sum->vote;
            $song->score = $song->votes_count == 0 ? 0 : $song->vote_sum / $song->votes_count;
        }
        $songs = $songs->sortBy(function($song) {
            return $song->playtime.'-'.(1 - 0.1 * $song->score);
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

    public function Download($id)
    {
        $song = Song::find($id);
        if (empty($song)) {
            abort(404);
        }
        return response()->download('uploads/'.$song->file->md5.'.mp3', $song->name.'.mp3');
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
