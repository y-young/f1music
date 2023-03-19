<?php

namespace App\Listeners;

use App\Events\FileDeleting;
use App\Events\SongDeleted;
use App\Models\File;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SyncFile
{
    public function handleSongDeleted(SongDeleted $event)
    {
        Log::info('OnDeleted event triggered on song ' . $event->song->id);
        if ($event->song->isForceDeleting()) {
            Log::info('Song ' . $event->song->file_id . ' force deleted');
            if ($event->song->file->songs()->withTrashed()->count() == 0) {
                // 文件无已关联的曲目,则彻底删除
                Log::info('Song ' . $event->song->file_id . ' has no related files');
                File::destroy($event->song->file_id); // 存储系统的文件同步由FileDeleting事件触发
            }
        }
    }

    public function handleFileDeleting(FileDeleting $event)
    {
        Log::info('OnDeleting event triggered on file' . $event->file->id);
        if ($event->file->songs()->withTrashed()->count() == 0) { // 无关联的活跃曲目 TODO
            Log::info('File ' . $event->file->id . ' force deleted');
            Storage::disk('public')->delete($event->file->md5 . '.mp3');
        } else {
            return false; // 停止删除操作
        }
    }

    public function subscribe(Dispatcher $events): void
    {
        $events->listen(
            SongDeleted::class,
            [SyncFile::class, 'handleSongDeleted']
        );
        $events->listen(
            FileDeleting::class,
            [SyncFile::class, 'handleFileDeleting']
        );
    }
}