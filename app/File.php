<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $table = 'files';
    protected $guarded = [];
    public $timestamps = false;
    protected $events = [
        'deleted' => FileDeleted::class
    ];

    public function url() {
       return '/uploads/'.$this->md5.'.mp3';
    }

    public function songs() {
        return $this->hasMany('App\Song');
    }
}
