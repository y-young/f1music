<?php

namespace App\Http\Controllers;

use App\Common\AuthData;
use App\Common\AuthResult;
use App\Common\CampusAuth;
use App\Common\Cookie;
use App\Models\User;
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
        Validator::make($request->all(), [
            // 寄读生学号为10位,如GJ16010001
            'stuId' => 'required | string | between:10,11',
            'password' => 'required | string | not_in:123456'
        ], self::$messages)->validate();

        $id = $request->input('stuId');
        if (Auth::check() && Auth::id() === $id) {
            return $this->success();
        }

        $authData = new AuthData($id, $request->input('password'));
        switch (CampusAuth::login($authData)) {
            case AuthResult::Success:
                $user = User::firstOrNew(['id' => $id]);
                // Auth::loginUsingId will attempt to retrieve the user from the database,
                // since we don't store user data in advance, this won't work.
                Auth::login($user, true);
                $request->session()->regenerate();
                // Set public cookie for frontend
                return $this->success()->withCookie(Cookie::make($id));
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
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        Cookie::forget();
        return $this->success();
    }
}