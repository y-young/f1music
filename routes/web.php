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

$router->get('/', function () {
    return view('index');
});
$router->get('/manage', ['middleware' => 'admin', function() {
    return view('admin');
}]);
$router->get('/logout', 'AuthController@Logout');

$router->get('/api/download/{id:[0-9]+}', [
    'middleware' => ['throttle:30', 'download'],
    'uses' => 'ManageController@Download'
]);

//Since Lumen does not support nested route groups, we will use parallel ones instead
$router->get('/api/playlist', 'MusicController@Playlist');

$router->post('/api/login', [
    'middleware' => 'throttle:20',
    'uses' => 'AuthController@Login'
]);

$router->group(['prefix' => 'api', 'middleware' => 'auth'], function () use ($router) {
    $router->get('/uploads', [
        'middleware' => 'throttle:40',
        'uses' => 'UploadController@Uploads'
    ]);
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
});

$router->group(['prefix' => 'api', 'middleware' => 'admin'], function () use ($router) {
    $router->get('/songs', 'ManageController@getSongs');
    $router->get('/songs/{id:[0-9]+}', 'ManageController@viewSong');
    $router->put('/songs', 'ManageController@editSong');
    $router->post('/songs/trash', 'ManageController@trashSongs');
    $router->get('/songs/trashed', 'ManageController@getTrashedSongs');
    $router->post('/songs/restore', 'ManageController@restoreSongs');
    $router->delete('/songs', ['middleware' => 'can:admin', 'uses' => 'ManageController@deleteSongs']);

    $router->get('/files', 'ManageController@getFiles');

    $router->get('/reports', 'ManageController@getReports');
    $router->delete('/reports', 'ManageController@deleteReports'); 

    $router->get('/votes/rank', [
        'middleware' => 'can:admin',
        'uses' => 'ManageController@getRank'
    ]);
    $router->get('/votes/analyze', [
        'middleware' => 'can:admin',
        'uses' => 'ManageController@Analyze'
    ]);
    $router->get('/statistics', [
        'middleware' => 'can:admin',
        'uses' => 'ManageController@Statistics'
    ]);
});

$router->group(['prefix' => 'api/music', 'middleware' => ['auth', 'throttle:40']], function () use ($router) {
    $router->post('/search', 'MusicController@Search');
    $router->post('/mp3', 'MusicController@Mp3');
});
