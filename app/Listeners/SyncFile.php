<?php

namespace App\Listeners;

use App\File;
use App\Song;
use Illuminate\Support\Facades\Storage;

class SyncFile
{

    public function onSongDeleted($event) {}

    public function onFileDeleted($event) {}

    public function subscribe($events) {
        $events->listen(
            'Illuminate\Auth\Events\Login',
            'App\Listeners\SyncFile@onSongDeleted'
        );
        $events->listen(
            'Illuminate\Auth\Events\Logout',
            'App\Listeners\SyncFile@onFileDeleted'
        ); 
    }
}
