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
    public function onSongDeleting($event)
    {
Log::info('TrashedSong'.$event->song->id);
        if (!Song::withTrashed()->where('file_id', $event->song->file_id)->exists()) { //文件无已关联的曲目,则彻底删除
Log::info('FileNotexists'.$event->song->file_id);
            File::withTrashed()->where('id', $event->song->file_id)->forceDelete(); //存储系统的文件同步由FileDeleted事件触发
        }
    }

    public function onFileDeleting($event)
    {
        if (!File::withTrashed()->where('id', $event->file->id)->exists()) { //文件已从数据库被彻底删除,则删除存储文件
            Log::info('ForceDeleted'.$event->file->id);
            Storage::disk('public')->delete($event->song->file->md5.'.mp3');
        }
    }

    public function subscribe($events)
    {
        $events->listen(
            'App\Events\SongDeleting',
            'App\Listeners\SyncFile@onSongDeleting'
        );
        $events->listen(
            'App\Events\FileDeleting',
            'App\Listeners\SyncFile@onFileDeleting'
        ); 
    }
}
