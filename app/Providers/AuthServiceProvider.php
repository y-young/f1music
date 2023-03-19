<?php

namespace App\Providers;

use App\Common\AuthResult;
use App\Common\CampusAuth;
use App\Common\Cookie;
use App\Models\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        Auth::viaRequest('api', function (Request $request) {
            $stuId = $this->checkLogin($request);
            if ($stuId) {
                return new User(['id' => $stuId]);
            }
            return null;
        });

        Gate::define('admin', function (User $user) {
            return in_array($user->id, config('music.admin'));
        });
        Gate::define('censor', function (User $user) {
            return in_array($user->id, config('music.censor'));
        });
    }

    public function checkLogin(Request $request): string|null
    {
        $id = $request->session()->get('id');
        $authData = Cookie::get($request);
        if (!empty($authData)) {
            if ($id === $authData->stuId) {
                return $id;
            } elseif (CampusAuth::login($authData) == AuthResult::Success) {
                $request->session()->put('id', $authData->stuId);
                return $authData->stuId;
            } else {
                return null;
            }
        }
        return null;
    }
}