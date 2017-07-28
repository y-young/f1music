<?php

namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Config;

class AuthController extends Controller
{

    public static $url = 'http://fzyz.net/sys/login.shtml';
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
			      curl_setopt($ch, CURLOPT_URL, self::$url);
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
        $stuId = $request->session()->get('stuId');
        $authData = Cookie::get();
		    if(!empty($authData)) {
            if($stuId = $authData->stuId)
			          return $stuId;
            elseif(self::campusAuth($authData) == 1) {
                $request->session()->put('stuId', $authData->stuId);
                return $authData->stuId;
		        }
            else
                return false;
        }
        return false;
    }

    public static function Login(Request $request) {
        if(self::checkLogin($request)) {
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

    public static function isAdmin(Request $request) {
        $authData = Cookie::get();
        $admins = Config::get('music.admin');
        if(!self::checkLogin($request))
            return false;
        return in_array($authData->stuId,$admins);
    }

}

class AuthData
{
    public $stuId = null;
    public $password = null;
    public $ip = null;
}

class Cookie
{
    public static function set(AuthData $authData) {
	      $cookieData = Crypt::encrypt(
	      json_encode([$authData->stuId, $authData->password]));
	     	setcookie('MusicAuth',$cookieData,time()+24*60*60);
	      $_COOKIE['MusicAuth'] = $cookieData;
    }

    public static function get() {
		    if((!isset($_COOKIE)) || (!isset($_COOKIE['MusicAuth']))){
			      return null;
		    }
		    $cookieData = $_COOKIE['MusicAuth'];
	    	$data = json_decode(Crypt::decrypt($cookieData));
		    $authData = new AuthData();
		    $authData->stuId = $data[0];
		    $authData->password = $data[1];
		    return $authData;
	  }

    public static function forget() {
	 	    setcookie('MusicAuth','',time()-3600);
	  }
}

class Session
{
    public static function get($key) {
		if(isset($_SESSION) && isset($_SESSION[$key])) {
			return $_SESSION[$key];
		} else {
			return null;
		}
	}

    public static function start() {
		if(!isset($_SESSION) && !headers_sent()) {
			session_start();
		}
		return !headers_sent();
	}

    public static function set($key,$value) {
        if(isset($_SESSION)) {
            $_SESSION[$key] = $value;
            return true;
        }
        return false;
    }

    public static function forget($key) {
        if(isset($_SESSION[$key])) {
            unset($_SESSION[$key]);
            return true;
        }
        return false;
    }
}
