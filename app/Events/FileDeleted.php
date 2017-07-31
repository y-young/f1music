<?php

namespace App\Events;

use App\File;

class FileDeleted extends Event
{

    public $file;

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
