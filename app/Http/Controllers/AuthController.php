<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Config;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class AuthController extends Controller
{
    public static function setCookie(AuthData $authData){
	      $cookieData = Crypt::encrypt(
	      json_encode([$authData->stuId, $authData->password]));
	     	setcookie('MusicAuth',$cookieData,time()+24*60*60);
	      $_COOKIE['MusicAuth'] = $cookieData;
    }

    public static function clearCookie(){
	 	    setcookie('MusicAuth','',time()-3600);
	  }

    public static function getCookie(){
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

    public static function setSession(AuthData $authData) {
        Session::set('stuId',$authData->stuId);
    }

    public static function clearSession() {
        Session::forget('stuId');
    }

	public static function campusAuth(AuthData $authData){
        Session::start();
		$url = 'http://fzyz.net/sys/login.shtml';
		$post_data = array(
				"staffCode" => $authData->stuId,
				"password" => $authData->password,
				"loginRole" => '2'
		);
        if(!Config::get('music.debugauth')) {
	        $ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
			$output = curl_exec($ch);
			$rinfo = curl_getinfo($ch);
            if(curl_errno($ch))
                return -1;
            curl_close($ch);
	        $result = (($output=="") && $rinfo['http_code']==302) ? 1 : 0;
		    if($result) {
                self::setCookie($authData);
                self::setSession($authData);
            }
        } else {
            self::setCookie($authData);
            self::setSession($authData);
            $result = 1;
        }
        return $result;
    }

    public static function checkLogin() {
		$stuId = Session::get('stuId');
        $authData = self::getCookie();
		if(!empty($authData) && $stuId == $authData->stuId){
			return true;
		} else {
            $authData = self::getCookie();
			if($authData){
                return self::campusAuth($authData);
			}
		}
        return false;
    }

    public static function Login(Request $request) {
        if(self::checkLogin())
            return response()->json(['error' => '0']);
        if($request->has('stuId') && $request->has('password')) {
            if($request->input('password') == '123456')
                return response ()->json([
                    'error' => '1',
                    'msg' => '为保证投票质量目前禁止使用校网初始密码登录,请更改密码'
                ]);
            $authData = new AuthData();
            $authData->stuId = $request->input('stuId');
            $authData->password = $request->input('password');
            switch(self::campusAuth($authData)) {
                case 1:
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
        return response()->json([
            'error' => '1',
            'msg' => '请输入学号和密码'
        ]);
    }

    public static function Logout() {
        self::clearCookie();
        self::clearSession();
        return redirect()->route('login');
    }

    public static function isAdmin() {
        $authData = self::getCookie();
        $admins = Config::get('music.admin');
        if(!self::checkLogin())
            return false;
        return in_array($authData->stuId,$admins);
    }

    public static function getStuId() {
        $authData = self::getCookie();
        return $authData->stuId;
    }
}

class AuthData
{
    public $stuId = null;
    public $password = null;
    public $ip = null;
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
