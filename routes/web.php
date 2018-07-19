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

$router->get('/', function () use ($router) {
    return view('index');
});
$router->get('/check', 'AuthController@checkLogin');
$router->get('/logout', 'AuthController@Logout');
$router->get('/playlist', 'MusicController@Playlist');

$router->post('/login', [
    'middleware' => 'throttle:20',
    'uses' => 'AuthController@Login'
]);

$router->group(['middleware' => 'auth'], function () use ($router) {
    $router->post('/upload', [
        'middleware' => 'throttle:20',
        'uses' => 'UploadController@Upload'
    ]);
    $router->post('/vote/list', [
        'middleware' => 'throttle:20',
        'uses' => 'VoteController@getSongs'
    ]);
    $router->post('/vote', [
        'middleware' => 'throttle:30',
        'uses' => 'VoteController@Vote'
    ]);
    $router->post('/report', [
        'middleware' => 'throttle:30',
        'uses' => 'ReportController@Report'
    ]);
    $router->get('/download/{id:[0-9]+}', [
        'middleware' => ['throttle:30', 'can:download'],
        'uses' => 'ManageController@Download'
    ]);
});

$router->group(['middleware' => 'admin'], function () use ($router) {
    $router->get('/', function() {
        return view('admin');
    });

    $router->get('/songs', 'ManageController@getSongs');
    $router->get('/songs/{id:[0-9]+}', 'ManageController@viewSong');
    $router->put('/songs', 'ManageController@editSong');
    $router->post('/songs/trash', 'ManageController@trashSongs');
    $router->get('/songs/trashed', 'ManageController@getTrashedSongs');
    $router->post('/songs/restore', 'ManageController@restoreSongs');
    $router->delete('/songs', ['middleware' => 'can:admin', 'uses' => 'ManageController@deleteSongs']);

    $router->get('/files', 'ManageController@getFiles');

    $router->get('/reports', 'ManageController@getReports');
    $router->delete('/report', 'ManageController@deleteReports');

    $router->get('/options', [
        'middleware' => 'can:admin',
        'uses' => 'ManageController@Options'
    ]);

    $router->get('/votes/rank', [
        'middleware' => 'can:admin',
        'uses' => 'ManageController@getRank'
    ]);
    $router->get('/log', [
        'middleware' => 'can:admin',
        'uses' => 'ManageController@Log'
    ]);
});

$router->group(['prefix' => 'music', 'middleware' => ['auth', 'throttle:40']], function () use ($router) {
    $router->post('/search', 'MusicController@Search');
    $router->post('/mp3', 'MusicController@Mp3');
});
