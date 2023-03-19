<?php

namespace App\Common;

use App\Common\AuthData;
use App\Common\AuthResult;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

class CampusAuth
{
    public static function login(AuthData $authData): AuthResult
    {
        if (config('music.debugAuth')) {
            return AuthResult::Success;
        }

        $postData = [
            "staffCode" => $authData->stuId,
            "password" => $authData->password,
            "loginRole" => '2'
        ];
        try {
            $response = Http::timeout(5)
                ->asForm()
                ->withoutRedirecting()
                ->post(config('music.loginUrl'), $postData);

            if ($response->failed()) {
                return AuthResult::ConnectionError;
            }
            return ($response->body() === "" && $response->status() === 302) ? AuthResult::Success : AuthResult::Failed;
        } catch (ConnectionException) {
            return AuthResult::ConnectionError;
        }
    }
}