<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SqlLogger
{
    public function handle($request, Closure $next)
    {
        DB::enableQueryLog();
        return $next($request);
    }

    public function terminate($request, $response)
    {
        $logs = DB::getQueryLog();
        foreach ($logs as $sql)  {
            Log::info('Query: '.var_export($sql, true));
        }
    }
}
