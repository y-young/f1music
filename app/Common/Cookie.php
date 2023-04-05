<?php

namespace App\Common;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie as CookieFacade;

class Cookie
{
    protected static $name = 'f1music_auth';
    protected static $publicName = 'f1music_user';
    protected static $minutes = 7 * 24 * 60;

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

    public static function makePublicCookie(string $id)
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
        return cookie(self::$publicName, base64_encode($data), self::$minutes, '/', httpOnly: false);
    }

    public static function make(AuthData $authData)
    {
        CookieFacade::queue(self::makePublicCookie($authData->stuId));
        // Set path to '/' to fix Cross-Origin problems
        return cookie(self::$name, json_encode($authData), self::$minutes, '/');
    }

    public static function forget()
    {
        CookieFacade::expire(self::$name);
        CookieFacade::expire(self::$publicName);
    }
}