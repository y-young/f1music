<?php

namespace App\Common;

class AuthData
{
    public function __construct(public string $stuId, public string $password)
    {
    }
}