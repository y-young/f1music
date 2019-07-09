<?php

namespace App;

use App\Events\FileDeleting;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $table = 'files';
    protected $guarded = [];
    public $timestamps = false;
    protected $appends = ['url'];
    protected $hidden = ['user_id'];
    protected $dispatchesEvents = [
        'deleting' => FileDeleting::class
    ];

    public function getUrlAttribute()
    {
       return '/uploads/'.$this->md5.'.mp3';
    }

    public function songs()
    {
        return $this->hasMany('App\Song');
    }
}
