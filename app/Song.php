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
    protected $dates = ['deleted_at'];
    protected $hidden = ['user_id'];
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
    
    public function getTagsAttribute($value) {
        if(! empty($value)) {
            return explode(',', $value);
        } else {
            return [];
        }
    }

    public function setTagsAttribute($value) {
        if(! empty($value)) {
            $this->attributes['tags'] = implode(',', $value);
        } else {
            $this->attributes['tags'] = null;
        }
    }

    public function scopeOfTime($query, $time)
    {
        return $query->where('playtime', $time); 
    }
}
