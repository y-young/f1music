<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
    protected $table = 'songs';
    protected $guarded = [];
    public $timestamps = false;

    public function file() {
         return $this->belongsTo('App\File');
    }

    public function votes() {
        return $this->hasMany('App\Vote');
    }
}
