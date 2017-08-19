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
        $songs = Song::withCount('reports')->get();
        return response()->json(['error' => 0, 'songs' => $songs]);
    }

    public function viewSong(Request $request)
    {
        $song = Song::with('reports')->where('id', $request->input('id'))->get();
        return response()->json(['error' => 0, 'song' => $song]);
    }

    public function editSong(Request $request)
    {
        $song = Song::find($request->input('id'));
        $song->name = $request->input('name');
        $song->origin = $request->input('origin');
        $song->save();
        return response()->json(['error' => 0]);
    }

    public function trashSongs(Request $request)
    {
        foreach ($request->input('id') as $id) {
           Song::destroy($id);
        }
        return response()->json(['error' => 0]);
    }

    public function getTrashedSongs()
    {
        return response()->json(['error' => 0, 'songs' => Song::onlyTrashed()->get()]);
    }

    public function restoreSongs(Request $request)
    {
        foreach ($request->input('id') as $id) {
            Song::withTrashed()->where('id', $id)->restore();
        }
        return response()->json(['error' => 0]);
    }

    public function deleteSongs(Request $request)
    {
        foreach ($request->input('id') as $id) {
            $song = Song::withTrashed()->find($id);
            if (!empty($song) && $song->trashed()) {
                //必须用find而不能用where,否则无法触发事件,见文档
                $song->forceDelete();
            }
        }
        return response()->json(['error' => 0]);
    }

    public function getFiles()
    {
        $files = File::all();
        return response()->json(['error' => 0, 'files' => $files]);
    }

    public function editFile(Request $request)
    {
        $file = File::find($request->input('id'));
        $file->md5 = $request->input('md5');
        $file->save();
        return response()->json(['error' => 0]);
    }

    public function trashFiles(Request $request)
    {
        foreach ($request->input('id') as $id) {
           File::destroy($id);
        }
        return response()->json(['error' => 0]);
    }

    public function getTrashedFiles()
    {
        return response()->json(['error' => 0, 'files' => File::onlyTrashed()->get()]);
    }

    public function restoreFiles(Request $request)
    {
        foreach ($request->input('id') as $id) {
            File::withTrashed()->where('id', $id)->restore();
        }
        return response()->json(['error' => 0]);
    }

    public function deleteFiles(Request $request)
    {
        foreach ($request->input('id') as $id) {
            File::withTrashed()->where('id', $id)->forceDelete();
        }
        return response()->json(['error' => 0]);
    }

    public function getReports()
    {
        $reports = Report::with('song')->get();
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
        return response()->json(['error' => 0, 'reports' => $reports]);
    }

    public function deleteReports(Request $request)
    {
        foreach ($request->input('id') as $id) {
            Report::destroy($id);
        }
        return response()->json(['error' => 0]);
    }

    public function getVotes()
    {
        $votes = Vote::with('song')->get();
        return response()->json(['error' => 0, 'votes' => $votes]);
    }

    public function getRank(Request $request)
    {
        $songs = Song::with('votes')->withCount('votes')->get();
        foreach ($songs as $song) {
            $song->vote_sum = $song->votes->sum->vote;
            $song->score = $song->votes_count == 0 ? 0 : $song->vote_sum / $song->votes_count;
        }
        $songs = $songs->sortByDesc('score')->sortBy('playtime');
        $songs = $songs->map(function ($song) {
            return [
                'id' => $song->id,
                'playtime' => $song->playtime,
                'name' => $song->name,
                'origin' => $song->origin,
                'score' => $song->score,
                'sum' => $song->vote_sum,
                'counts' => $song->votes_count
            ];
        });
        return response()->json(['error' => 0, 'songs' => $songs->values()]);
    }

    public function Options(Request $request)
    {
        return response()->json(['error' => 0, 'options' => Option::all()]);
    }

    public function editOption(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required | exists:options',
            'value' => 'nullable'
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => 1, 'msg' => $validator->errors()->first()]);
        }

        $option = Option::updateOrCreate(
            ['name' => $request->input('name')],
            ['value' => $request->input('value')]
        );
        return response()->json(['error' => 0]);
    }

    public function Log() {
        Log::debug('Test');
        Log::info('User Login:***REMOVED***');
        Log::error('Cannot connect to Database');
        Log::notice('Notice');
        return Storage::disk('log')->get('info.log');
    }
}
