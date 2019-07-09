<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
    protected function success($key = 'data', $data = null)
    {
        if (! empty($data)) {
            return response()->json(['error' => 0, $key => $data]);
        } else {
            return response()->json(['error' => 0]);
        }
    }

    protected function error($msg, $error = 1)
    {
        return response()->json(['error' => $error, 'msg' => $msg]);
    }
}
