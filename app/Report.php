<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $table = 'reports';
    protected $guarded = [];
    public $timestamps = false;

    public function song() {
        return $this->belongsTo('App\Song');
    }
}
