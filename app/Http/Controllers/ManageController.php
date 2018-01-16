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
use Illuminate\Support\Facades\Storage;

class ManageController extends Controller
{
    public function getSongs()
    {
        $songs = Song::with('file')->withCount('reports')->get();
        return $this->success('songs', $songs);
    }

    public function viewSong(Request $request)
    {
        $song = Song::with('reports', 'file')->where('id', $request->input('id'))->first();
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
        if (config('music.openVote')) {
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
        if (config('music.openVote')) {
            return $this->error('开放投票期间禁止删除曲目');
        }
        foreach ($request->input('id') as $id) {
            $song = Song::withTrashed()->find($id);
            if (! empty($song) && $song->trashed()) {
                //必须用find而不能用where,否则无法触发事件,见文档
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
        // $id = 0;
        // $reports = $reports->mapWithKeys(function ($report, $id) {
        //     $id++;
        //     return [
        //         $id => [
        //             'id' => $report->id,
        //             'song_id' => $report->song_id,
        //             'song' => $report->song->name,
        //             'url' => $report->song->url,
        //             'reason' => $report->reason,
        //             'reporter' => $report->reporter,
        //             'time' => $report->time
        //         ]
        //     ];
        // });
        return $this->success('reports', $reports);
    }

    public function deleteReports(Request $request)
    {
        foreach ($request->input('id') as $id) {
            Report::destroy($id);
        }
        return $this->success();
    }

    public function getVotes()
    {
        $votes = Vote::with('song')->get();
        return $this->success('votes', $votes);
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
        return $this->success('songs', $songs->values());
    }

    public function Options(Request $request)
    {
        return $this->success('options', Option::all());
    }

    public function editOption(Request $request)
    {
        Validator::make($request->all(), [
            'name' => 'required | exists:options',
            'value' => 'nullable'
        ])->validate();

        $option = Option::updateOrCreate(
            ['name' => $request->input('name')],
            ['value' => $request->input('value')]
        );
        return $this->success();
    }

    public function Download($id)
    {
        $song = Song::find($id);
        if (empty($song)) {
            abort(404);
        }
        return response()->download('uploads/'.$song->file->md5.'.mp3', $song->name.'.mp3');
    }

    public function Log()
    {
        Log::debug('Test');
        Log::info('User Login:***REMOVED***');
        Log::error('Cannot connect to Database');
        Log::notice('Notice');
        return Storage::disk('log')->get('info.log');
    }
}
