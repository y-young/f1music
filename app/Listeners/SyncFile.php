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
Log::info('OnDeletingSong'.$event->song->id);
        if ($event->song->isForceDeleting()) {
Log::info('FDeleting'.$event->song->file_id);
            if (!Song::withTrashed()->where('file_id', $event->song->file_id)->exists()) {
            //文件无已关联的曲目,则彻底删除
Log::info('FileNotexists'.$event->song->file_id);
                File::withTrashed()->find($event->song->file_id)->forceDelete(); //存储系统的文件同步由FileDeleting事件触发
            }
        }
    }

    public function onFileDeleting($event)
    {  Log::info('OnDeletingFile');
        if (!File::withTrashed()->find($event->file->id)->exists()) { //文件已从数据库被彻底删除,则删除存储文件
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
