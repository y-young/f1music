<?php

namespace App\Common;

enum Permission: int
{
    case User = 0;
    case Censor = 10;
    case Admin = 20;
}