<?php

namespace App;

use App\Events\SongDeleted;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; 

class Song extends Model
{
    use SoftDeletes;

    protected $table = 'songs';
    protected $guarded = [];
    public $timestamps = false;
    protected $dates = ['deleted_at'];
    protected $hidden = ['deleted_at'];
    protected $events = [
        'deleted' => SongDeleted::class
    ];

    public function file() {
         return $this->belongsTo('App\File');
    }

    public function votes() {
        return $this->hasMany('App\Vote');
    }

    public function reports() {
        return $this->hasMany('App\Report');
    }

    public function getVoteSumAttribute() {
        $votes = $this->votes;
        return $votes->sum->vote;
    }
}
