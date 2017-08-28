<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';
    protected $guarded = [];
    public $primaryKey = 'user_id';
    public $incrementing = false;
    public $timestamps = false;

    public function getOrderAttribute($value)
    {
        return empty($value) ? [] : explode(',', $value);
    }

    public function setOrderAttribute($value)
    {
        $this->attributes['order'] = $value->implode('id', ',');
    }
}
