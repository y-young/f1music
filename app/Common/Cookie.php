<?php

namespace App\Common;

use Illuminate\Support\Facades\Cookie as CookieFacade;

class Cookie
{
    protected static $name = 'f1music_user';
    protected static $minutes = 60 * 24 * 60;

    public static function make(string $id)
    {
        $permission = Permission::User;
        if (in_array($id, config('music.admin'))) {
            $permission = Permission::Admin;
        } elseif (in_array($id, config('music.censor'))) {
            $permission = Permission::Censor;
        }
        $data = json_encode([
            'id' => $id,
            'permission' => $permission
        ]);
        return cookie(self::$name, base64_encode($data), self::$minutes, '/', httpOnly: false);
    }

    public static function forget()
    {
        CookieFacade::expire(self::$name);
    }
}