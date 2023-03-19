<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vote extends Model
{
    protected $table = 'votes';
    protected $guarded = [];
    protected $hidden = ['user_id'];

    public function song(): BelongsTo
    {
        return $this->belongsTo(Song::class);
    }
}