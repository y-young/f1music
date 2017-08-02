<?php

namespace App\Http\Controllers;

use App\File;
use App\Song;
use App\Vote;
use App\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ManageController extends Controller
{
    public function getSongs()
    {
        $songs = Song::all();
        return response()->json(['error' => 0, 'songs' => $songs]);
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
            Song::withTrashed()->where('id', $id)->forceDelete();
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
        $reports = Report::all();
        return response()->json(['error' => 0, 'reports' => $reports]);
    }

    public function deleteReports(Request $request)
    {
        foreach ($request->input('id') as $id) {
            Report::withTrashed()->where('id', $id)->forceDelete();
        }
        return response()->json(['error' => 0]);
    }

    public function getRank(Request $request)
    {
        $songs = Song::withCount('votes')->get();
        $list = collection([]);
        $songs = $songs->mapWithKeys(function($song) {
            $score = $song->votes_count == 0 ? 0 : $song->vote_sum / $song->votes_count;
var_export($score);
            return [[$song->id => $score]];
        });
        var_export($songs);
        //return response()->json(['error' => 0, 'songs' => ]);
    }

    public function Log() {
        return Storage::disk('log')->get('lumen.log');
    }
}
