<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    protected $table = 'options';
    protected $guarded = [];
    public $primaryKey = 'name';
    public $incrementing = false;
    public $timestamps = false;
    public $asArray = ['ban_upload', 'ban_vote', 'censor'];

    public function getValueAttribute($value)
    {
        if (in_array($this->name, $this->asArray)) {
            return empty($value) ? [] : explode(',', $value);
        } else {
            return $value;
        }
    }
}
