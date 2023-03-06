<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';
    protected $guarded = [];
    public $primaryKey = 'user_id';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected function order(): Attribute
    {
        return Attribute::make(
        get: fn(string $value) => empty($value) ? [] : collect(explode(',', $value)),
        set: fn(Collection $value) => $value->implode(','),
        );
    }
}