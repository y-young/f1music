<?php

namespace App\Common;

enum AuthResult
{
    case Success;
    case Failed;
    case ConnectionError;
}