<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AdminAuth
{
    public function handle(Request $request, Closure $next)
    {
        if (Gate::denies('censor') && Gate::denies('admin')) {
            abort(403);
        }
        return $next($request);
    }
}