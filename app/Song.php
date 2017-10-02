<?php

namespace App;

use App\Events\SongDeleting;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Song extends Model
{
    use SoftDeletes;

    protected $table = 'songs';
    protected $guarded = [];
    protected $dates = ['deleted_at'];
    protected $hidden = ['deleted_at'];
    protected $dispatchesEvents = [
        'deleted' => SongDeleted::class
    ];

    public function file()
    {
         return $this->belongsTo('App\File');
    }

    public function votes()
    {
        return $this->hasMany('App\Vote');
    }

    public function reports()
    {
        return $this->hasMany('App\Report');
    }

    public function getUrlAttribute()
    {
        return $this->file->url;
    }
    
    public function scopeOfTime($query, $time)
    {
        return $query->where('playtime', $time); 
    }
}
