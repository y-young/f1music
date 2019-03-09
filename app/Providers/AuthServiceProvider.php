<?php

namespace App\Providers;

use App\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Boot the authentication services for the application.
     *
     * @return void
     */
    public function boot()
    {
        $this->app['auth']->viaRequest('api', function ($request) {
            $stuId = $this->checkLogin($request);
            if ($stuId) {
                return new User(['stuId' => $stuId]);
            }
            return null;
        });

        Gate::define('admin', function ($user) {
            return in_array($user->stuId, config('music.admin')); 
        });
        Gate::define('censor', function ($user) {
            return in_array($user->stuId, config('music.censor')); 
        });
    }

    public function campusAuth(AuthData $authData)
    {
        $post_data = [
            "staffCode" => $authData->stuId,
            "password" => $authData->password,
            "loginRole" => '2'
        ];
        if (! config('music.debugauth')) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, config('music.loginUrl'));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
            $output = curl_exec($ch);
            $rinfo = curl_getinfo($ch);
            if (curl_errno($ch)) {
                return -1;
            }
            curl_close($ch);
            $result = (($output=="") && $rinfo['http_code'] == 302) ? 1 : 0;
        } else {
            $result = 1;
        }
        return $result;
    }

    public function checkLogin($request)
    {
        $stuId = $request->session()->get('stuId');
        $authData = Cookie::get();
        if (! empty($authData)) {
            if ($stuId == $authData->stuId) {
                return $stuId;
            } elseif ($this->campusAuth($authData) == 1) {
                $request->session()->put('stuId', $authData->stuId);
                return $authData->stuId;
		    } else {
                return false;
            }
        }
        return false;
    }
}

class AuthData
{
    public $stuId = null;
    public $password = null;
}

class Cookie
{
    public static function get()
    {
        if ((!isset($_COOKIE)) || (!isset($_COOKIE['MusicAuth']))) {
		    return null;
        }
        $cookieData = $_COOKIE['MusicAuth'];
        $data = json_decode(Crypt::decrypt($cookieData));
        $authData = new AuthData();
	    $authData->stuId = $data[0];
		$authData->password = $data[1];
		return $authData;
	  }
}
