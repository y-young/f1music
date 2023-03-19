<?php

namespace App\Models;

use App\Events\FileDeleting;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    protected function url(): Attribute
    {
        return Attribute::make(
        get: fn() => '/uploads/' . $this->md5 . '.mp3',
        );
    }

    public function songs(): HasMany
    {
        return $this->hasMany(Song::class);
    }
}