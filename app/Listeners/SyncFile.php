<?php

namespace App\Listeners;

use Log;
use App\File;
use App\Song;
use Illuminate\Support\Facades\Storage;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class SyncFile
{
    public function onSongDeleted($event)
    {
        //
    }

    public function onFileDeleted($event)
    {
        if (!File::withTrashed()->where('id', $event->file->id)->exists()) {
            Log::info('ForceDeleted'.$event->file->id);
        }
    }

    public function subscribe($events)
    {
        $events->listen(
            'App\Events\SongDeleted',
            'App\Listeners\SyncFile@onSongDeleted'
        );
        $events->listen(
            'App\Events\FileDeleted',
            'App\Listeners\SyncFile@onFileDeleted'
        ); 
    }
}
