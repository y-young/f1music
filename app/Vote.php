<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    protected $table = 'votes';
    protected $guarded = [];
    protected $hidden = ['user_id'];

    public function song() {
        return $this->belongsTo('App\Song');
    }
}
