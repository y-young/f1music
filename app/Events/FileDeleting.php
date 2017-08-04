<?php

namespace App\Events;

use App\File;

class FileDeleting extends Event
{

    public $file;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(File $file)
    {
        $this->file = $file;
    }
}
