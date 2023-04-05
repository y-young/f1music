<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Session\Middleware\AuthenticateSession;
use Illuminate\Support\Facades\Gate;

class AdminAuth extends AuthenticateSession
{
    public function handle($request, Closure $next)
    {
        if ($this->auth->guard()->guest()) {
            abort(401);
        }
        if (Gate::denies('censor') && Gate::denies('admin')) {
            abort(403);
        }
        return $next($request);
    }
}