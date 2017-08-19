<?php

namespace App\Http\Middleware;

use Closure;
use DB;
use Log;

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
