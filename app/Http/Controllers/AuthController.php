<?php

namespace App\Http\Controllers;

use App\Common\AuthData;
use App\Common\AuthResult;
use App\Common\CampusAuth;
use App\Common\Cookie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected static $messages = [
        'stuId.required' => '请输入学号',
        'stuId.between' => '学号应为10或11位',
        'password.required' => '请输入密码',
        'password.not_in' => '为保证投票质量禁止使用校园网初始密码登录,请更改密码'
    ];

    public function login(Request $request)
    {
        if (Auth::check()) {
            return $this->success();
        }

        Validator::make($request->all(), [
            // 寄读生学号为10位,如GJ16010001
            'stuId' => 'required | between:10,11',
            'password' => 'required | not_in:123456'
        ], self::$messages)->validate();

        $authData = new AuthData($request->input('stuId'), $request->input('password'));
        switch (CampusAuth::login($authData)) {
            case AuthResult::Success:
                $request->session()->put('id', $authData->stuId);
                return $this->success()->withCookie(Cookie::make($authData));
            case AuthResult::Failed:
                return $this->error('用户名或密码错误');
            case AuthResult::ConnectionError:
                return $this->error('无法连接校园网,请等待校网恢复后再登录');
        }
    }

    public function check(Request $request)
    {
        if (Auth::check()) {
            return $this->success('user', Auth::user());
        } else {
            return $this->error('未登录')->setStatusCode(401);
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        Cookie::forget();
        $request->session()->forget('id');
        return $this->success();
    }
}