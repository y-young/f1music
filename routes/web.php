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
$router->get('/Check', 'AuthController@checkLogin');
$router->get('/Logout', 'AuthController@Logout');

$router->post('/Login', [
    'middleware' => 'throttle:20',
    'uses' => 'AuthController@Login'
]);

$router->group(['middleware' => 'auth'], function () use ($router) {
    $router->post('/Upload', [
        'middleware' => ['throttle:20', 'can:upload'],
        'uses' => 'UploadController@Upload'
    ]);
    $router->post('/List', [
        'middleware' => 'throttle:20',
        'uses' => 'VoteController@getSongs'
    ]);
    $router->post('/Vote', [
        'middleware' => ['throttle:30', 'can:vote'],
        'uses' => 'VoteController@Vote'
    ]);
    $router->post('/Report', [
        'middleware' => 'throttle:30',
        'uses' => 'ReportController@Report'
    ]);
});

$router->group(['prefix' => 'Manage', 'middleware' => 'admin'], function () use ($router) {
    $router->get('/', function() {
        return view('admin');
    });

    $router->get('/Songs', 'ManageController@getSongs');
    $router->post('/Song/View', 'ManageController@viewSong');
    $router->post('/Song/Edit', 'ManageController@editSong');
    $router->post('/Song/Trash', 'ManageController@trashSongs');
    $router->get('/Songs/Trashed', 'ManageController@getTrashedSongs');
    $router->post('/Song/Restore', 'ManageController@restoreSongs');
    $router->post('/Song/Delete', ['middleware' => 'can:admin', 'uses' => 'ManageController@deleteSongs']);

    $router->get('/Files', 'ManageController@getFiles');

    $router->get('/Reports', 'ManageController@getReports');
    $router->post('/Report/Delete', 'ManageController@deleteReports');

    $router->get('/Options', [
        'middleware' => 'can:admin',
        'uses' => 'ManageController@Options'
    ]);
    $router->post('/Option/Edit', [
        'middleware' => 'can:admin',
        'uses' => 'ManageController@editOption'
    ]);

    $router->get('/Votes', [
        'middleware' => 'can:admin',
        'uses' => 'ManageController@getVotes'
    ]);
    $router->get('/Rank', [
        'middleware' => 'can:admin',
        'uses' => 'ManageController@getRank'
    ]);
    $router->get('/Log', [
        'middleware' => 'can:admin',
        'uses' => 'ManageController@Log'
    ]);
});

$router->group(['prefix' => 'Music', 'middleware' => ['auth', 'throttle:40']], function () use ($router) {
    $router->post('/Search', 'MusicController@Search');
    $router->post('/Mp3', 'MusicController@Mp3');
    $router->get('/Playlist', 'MusicController@Playlist');
});
