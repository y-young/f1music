<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class DownloadAuth
{
    public function handle(Request $request, Closure $next)
    {
        if (!config('music.openDownload')) {
            if (Gate::denies('censor') && Gate::denies('admin')) {
                abort(403);
            }
        }
        return $next($request);
    }
}