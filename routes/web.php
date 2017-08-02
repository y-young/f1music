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
    return view('index');
});
$app->get('/Check', 'AuthController@checkLogin');
$app->get('/Logout', 'AuthController@Logout');

/*$app->group(['middleware' => 'redirect'], function () use ($app) {
    $app->get('/Login', ['as' => 'login', function() {
        return view('login');
    }]);
});*/
$app->get('/Login', 'AuthController@Login');

$app->group(['middleware' => 'auth'], function () use ($app) {
    $app->post('/Upload', 'UploadController@Upload');
    $app->get('/Vote', 'VoteController@Vote');
    $app->post('/Report', 'ReportController@Report');
});

$app->group(['prefix' => 'Manage', 'middleware' => 'admin'], function() use ($app) {
    $app->get('/', function() {
        return view('admin');
    });

    $app->get('/Songs', 'ManageController@getSongs');
    $app->get('/Song/Trash', 'ManageController@trashSongs');
    $app->get('/Song/Trashed', 'ManageController@getTrashedSongs');
    $app->get('/Song/Delete', 'ManageController@deleteSongs');

    $app->get('/Files', 'ManageController@getFiles');
    $app->get('/File/Trash', 'ManageController@trashFiles');
    $app->get('/File/Trashed', 'ManageController@getTrashedFiles');
    $app->get('/File/Delete', 'ManageController@deleteFiles');

    $app->get('/Reports', 'ManageController@getReports');
    $app->get('/Report/Delete', 'ManageController@deleteReports');

    $app->get('/Rank', 'ManageController@getRank');
    $app->get('/Log', 'ManageController@Log');
});

$app->post('/List', 'VoteController@List');
$app->group(['prefix' => 'Music'], function () use ($app) {
    $app->get('/Search', 'MusicController@Search');
    $app->get('/Mp3', 'MusicController@Mp3');
    $app->get('/Playlist', 'MusicController@Playlist');
});
