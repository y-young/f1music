<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    protected $table = 'reports';
    protected $guarded = [];
    public $timestamps = false;

    public function song(): BelongsTo
    {
        return $this->belongsTo(Song::class);
    }
}