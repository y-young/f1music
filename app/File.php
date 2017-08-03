<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class File extends Model
{
    use SoftDeletes;

    protected $table = 'files';
    protected $guarded = [];
    public $timestamps = false;
    protected $dates = ['deleted_at'];
    protected $hidden = ['deleted_at'];
    protected $appends = ['url'];
    protected $events = [
        'deleted' => FileDeleted::class
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
