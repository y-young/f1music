<?php

namespace App\Listeners;

use Log;
use App\File;
use Illuminate\Support\Facades\Storage;

class SyncFile
{
    public function onSongDeleted($event)
    {
        Log::info('OnDeleted Song' . $event->song->id);
        if ($event->song->isForceDeleting()) {
            Log::info('ForceDeleted Song' . $event->song->file_id);
            if ($event->song->file->songs()->withTrashed()->count() == 0) {
                //文件无已关联的曲目,则彻底删除
                Log::info('FileNotExists' . $event->song->file_id);
                File::destroy($event->song->file_id); //存储系统的文件同步由FileDeleting事件触发
            }
        }
    }

    public function onFileDeleting($event)
    {
        Log::info('OnDeleting File');
        if ($event->file->songs()->withTrashed()->count() == 0) { // 无关联的活跃曲目 TODO
            Log::info('ForceDeleted File' . $event->file->id);
            Storage::disk('public')->delete($event->file->md5 . '.mp3');
        } else {
            return false; // 停止删除操作
        }
    }

    public function subscribe($events)
    {
        $events->listen(
            'App\Events\SongDeleted',
            'App\Listeners\SyncFile@onSongDeleted'
        );
        $events->listen(
            'App\Events\FileDeleting',
            'App\Listeners\SyncFile@onFileDeleting'
        );
    }
}
