<?php

namespace App\Events;

use App\Song;

class SongDeleted extends Event
{

    public $song;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }
}
