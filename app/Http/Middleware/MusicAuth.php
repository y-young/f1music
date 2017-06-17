<?php
namespace App\Http\Middleware;
use Closure;
use App\Http\Controllers\AuthController;

class MusicAuth
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
        if(!AuthController::checkLogin())
            return redirect('/Login');
        return $next($request);
    }
}
