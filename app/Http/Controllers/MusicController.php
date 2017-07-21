<?php

namespace App\Http\Controllers;
use App\Http\Response;
use Illuminate\Support\Facades\Config;
use Illuminate\Http\Request;
use Metowolf\Meting;

class MusicController extends Controller
{

    public static $API;

    public function _construct() {
        
    }

    public function Search(Request $req) {
        if($req->has('keyword')) {
            self::$API = new Meting('netease');
            return self::$API->format(true)->search($req->input('keyword'));
        }
    }

    public function Mp3(Request $req) {
        if($req->has('id')) {
            self::$API = new Meting('netease');
            return json_decode(self::$API->format(true)->url($req->input('id')))->url;
        }
    }
}
