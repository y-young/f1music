<?php

namespace App\Models;

use App\Events\SongDeleted;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Song extends Model
{
    use SoftDeletes;

    protected $table = 'songs';
    protected $guarded = [];
    protected $hidden = ['user_id'];
    protected $dispatchesEvents = [
        'deleted' => SongDeleted::class
    ];

    public function file(): BelongsTo
    {
        return $this->belongsTo(File::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    protected function url(): Attribute
    {
        return Attribute::make(
        get: fn() => $this->file->url,
        );
    }

    protected function tags(): Attribute
    {
        return Attribute::make(
        get: fn(string|null $value) => empty($value) ? [] : explode(',', $value),
        set: fn(array $value) => empty($value) ? null : implode(',', $value),
        );
    }

    public function scopeOfTime(Builder $query, string $time): void
    {
        $query->where('playtime', $time);
    }
}