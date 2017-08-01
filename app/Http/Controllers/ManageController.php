<?php

namespace App\Http\Controllers;

use App\File;
use App\Song;
use App\Vote;
use App\Report;

class ManageController extends Controller
{
    public function deleteSong() {
       Song::withTrashed()->find(7)->forceDelete();
    }

    public function getTrashedSongs() {
        return response()->json(Song::onlyTrashed()->get());
    }
}
