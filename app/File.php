<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $table = 'files';
    protected $guarded = [];
    public $timestamps = false;
    public function url() {
       return '/uploads/'.$this->md5.'.mp3';
    }
}
