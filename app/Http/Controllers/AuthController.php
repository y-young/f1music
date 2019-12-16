<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public static $messages = [
        'stuId.required' => '请输入学号',
        'stuId.between' => '学号应为10或11位',
        'password.required' => '请输入密码',
        'password.not_in' => '为保证投票质量禁止使用校园网初始密码登录,请更改密码'
    ];

    public static function campusAuth(AuthData $authData)
    {
        $postData = [
            "staffCode" => $authData->stuId,
            "password" => $authData->password,
            "loginRole" => '2'
        ];
        if (!config('music.debugAuth')) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, config('music.loginUrl'));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_TIMEOUT, 5);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
            $response = curl_exec($ch);
            $info = curl_getinfo($ch);
            if (curl_errno($ch)) {
                return -1;
            }
            curl_close($ch);
            $result = (($response == "") && $info['http_code'] == 302) ? 1 : 0;
        } else {
            $result = 1;
        }
        return $result;
    }

    public static function checkLogin()
    {
        if (Auth::check()) { //TODO
            var_export(Auth::user()->stuId);
        } else {
            return 0;
        }
    }

    public function Login(Request $request)
    {
        if (Auth::check()) {
            return $this->success();
        }

        Validator::make($request->all(), [
            'stuId' => 'required | between: 10,11', // 寄读生学号为10位,如GJ16010001
            'password' => 'required | not_in:123456'
        ], self::$messages)->validate();

        $authData = new AuthData();
        $authData->stuId = $request->input('stuId');
        $authData->password = $request->input('password');
        switch (self::campusAuth($authData)) {
            case 1:
                Cookie::set($authData);
                $request->session()->put('stuId', $authData->stuId);
                return $this->success();
                break;
            case 0:
                return $this->error('用户名或密码错误');
                break;
            case -1:
                return $this->error('无法连接校园网,请等待校网恢复后再登录');
                break;
            default:
                return $this->error('未知错误');
                break;
        }
    }

    public function Logout(Request $request)
    {
        Cookie::forget();
        $request->session()->forget('stuId');
        return redirect('/#/login');
    }
}

class AuthData
{
    public $stuId = null;
    public $password = null;
}

class Cookie
{
    public static function set(AuthData $authData)
    {
        $cookieData = Crypt::encrypt(
            json_encode([
                $authData->stuId,
                $authData->password
            ])
        );
        setcookie('MusicAuth', $cookieData, time() + 24 * 60 * 60, '/'); //Set path to '/' to fix Cross-Origin problems
        $_COOKIE['MusicAuth'] = $cookieData;
    }

    public static function forget()
    {
        setcookie('MusicAuth', ' ', time() - 3600);
    }
}
