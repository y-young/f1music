<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    protected $table = 'votes';
    protected $guarded = [];

    public function song() {
        return $this->belongsTo('App\Song');
    }
}
