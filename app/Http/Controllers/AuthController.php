<?php

namespace App\Http\Controllers;

use Auth;
use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Config;

class AuthController extends Controller
{
    public static $messages = [
        'stuId.required' => '请输入学号',
        'stuId.size' => '学号应为11位',
        'password.required' => '请输入密码',
        'password.not_in' => '为保证投票质量目前禁止使用校网初始密码登录,请更改密码'
    ];

    public static function campusAuth(AuthData $authData) {
		    $post_data = [
				    "staffCode" => $authData->stuId,
				    "password" => $authData->password,
				    "loginRole" => '2'
		    ];
        if(!Config::get('music.debugauth')) {
	          $ch = curl_init();
			      curl_setopt($ch, CURLOPT_URL, Config::get('music.loginUrl'));
			      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			      curl_setopt($ch, CURLOPT_POST, 1);
			      curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
			      $output = curl_exec($ch);
			      $rinfo = curl_getinfo($ch);
            if(curl_errno($ch)) {
                return -1;
            }
            curl_close($ch);
	          $result = (($output=="") && $rinfo['http_code'] == 302) ? 1 : 0;
        } else {
            $result = 1;
        }
        return $result;
    }

    public static function checkLogin(Request $request) {
        if(Auth::check())
            var_export(Auth::user()->stuId);
        else
            return 0;
    }

    public static function Login(Request $request) {
        if(Auth::check()) {
            return response()->json(['error' => '0']);
        }
        
        $validator = Validator::make($request->all(), [
            'stuId' => 'required | size: 11',
            'password' => 'required | not_in:123456'
        ], self::$messages);
        if($validator->fails()) {
            return response ()->json(['error' => '1', 'msg' => $validator->errors()->first()]);
        }

        $authData = new AuthData();
        $authData->stuId = $request->input('stuId');
        $authData->password = $request->input('password');
        switch(self::campusAuth($authData)) {
            case 1:
                Cookie::set($authData);
                $request->session()->put('stuId', $authData->stuId);
                return response()->json(['error' => '0']);
                break;
           case 0:
                return response()->json([
                    'error' => '1',
                    'msg' => '用户名或密码错误'
                ]);
                break;
            case -1:
                return response()->json([
                    'error' => '1',
                    'msg' => '无法连接校园网,请等待校网恢复后再登录'
                ]);
                break;
            default:
                return response()->json([
                    'error' => '1',
                    'msg' => '未知错误'
                ]);
                break;
        }
    }

    public static function Logout(Request $request) {
        Cookie::forget();
        $request->session()->forget('stuId');
        return redirect()->route('login');
    }
}

class AuthData
{
    public $stuId = null;
    public $password = null;
}

class Cookie
{
    public static function set(AuthData $authData) {
	      $cookieData = Crypt::encrypt(
	      json_encode([$authData->stuId, $authData->password]));
	     	setcookie('MusicAuth',$cookieData,time()+24*60*60);
	      $_COOKIE['MusicAuth'] = $cookieData;
    }

    public static function forget() {
	 	    setcookie('MusicAuth','',time()-3600);
	  }
}
