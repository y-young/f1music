<?php

namespace App\Common;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie as CookieFacade;

class Cookie
{
    protected static $name = 'f1music_auth';

    public static function get(Request $request): AuthData|null
    {
        $cookie = $request->cookie(self::$name);
        if ($cookie == null) {
            return null;
        }
        $data = json_decode($cookie);
        if ($data == null) {
            return null;
        }
        return new AuthData($data->stuId, $data->password);
    }

    public static function make(AuthData $authData)
    {
        // Set path to '/' to fix Cross-Origin problems
        // TODO: Set httpOnly to true after frontend upgrade
        return cookie(self::$name, json_encode($authData), time() + 24 * 60 * 60, '/', httpOnly: false);
    }

    public static function forget()
    {
        CookieFacade::expire(self::$name);
    }
}