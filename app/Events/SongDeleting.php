<?php

namespace App\Events;

use App\Song;

class SongDeleting extends Event
{

    public $song;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Song $song)
    {
        $this->song = $song;
    }
}
