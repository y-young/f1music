<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$app->get('/', function () use ($app) {
   // return $app->version();
    return view('index');
});
$app->get('/Check', 'AuthController@checkLogin');
$app->get('/Logout', 'AuthController@Logout');
$app->group(['middleware' => 'redirect'], function () use ($app) {
    $app->get('/Login', ['as' => 'login', function() {
        return view('login');
    }]);
});
$app->get('/Help', function() {
    return view('help');
});
$app->get('/Vote/{type}', function($type) {
    return view('vote', ['type' => $type]);
});
$app->get('/Log', 'ListController@Log');
$app->post('/Login', 'AuthController@Login');
$app->group(['middleware' => 'adminauth', 'prefix' => 'Manage'], function() use ($app) {
    $app->get('/', function() {
        return view('admin.index');
    });
    $app->get('/Music', function() {
        return view('admin.music');
    });
    $app->get('/List', 'ListController@getList');
    $app->get('/List/{type}', 'ListController@getList');
    $app->get('/Log', function() {
        return view('admin.log');
    });
});

$app->group(['middleware' => 'musicauth'], function () use ($app) {
    $app->get('/Upload',function() {
        return view('upload');
    });
    $app->post('/Upload','UploadController@Upload');
    $app->get('/List/{type}','ListController@getList');
});
