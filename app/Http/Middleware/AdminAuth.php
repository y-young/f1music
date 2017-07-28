<?php

namespace App\Http\Middleware;

use Closure;
use App\Http\Controllers\AuthController;

class AdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(!AuthController::isAdmin($request))
            abort(404);
        return $next($request);
    }
}
