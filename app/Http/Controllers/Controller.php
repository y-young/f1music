<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    protected function success(string $key = 'data', $data = null)
    {
        if (!empty($data)) {
            return response()->json(['error' => 0, $key => $data]);
        } else {
            return response()->json(['error' => 0]);
        }
    }

    protected function error(string $msg, int $error = 1)
    {
        return response()->json(['error' => $error, 'msg' => $msg]);
    }
}