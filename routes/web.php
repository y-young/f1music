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

$app->group(['middleware' => 'redirect'], function () use ($app) {
    $app->get('/Login', ['as' => 'login', function() {
        return view('login');
    }]);
});
$app->post('/Login', [
    'middleware' => 'throttle:20',
    'uses' => 'AuthController@Login'
]);

$app->group(['middleware' => 'auth'], function () use ($app) {
    $app->post('/Upload', [
        'middleware' => ['throttle:20', 'can:upload'],
        'uses' => 'UploadController@Upload'
    ]);
    $app->post('/List', [
        'middleware' => 'throttle:20',
        'uses' => 'VoteController@getSongs'
    ]);
    $app->post('/Vote', [
        'middleware' => ['throttle:30', 'can:vote'],
        'uses' => 'VoteController@Vote'
    ]);
    $app->post('/Report', [
        'middleware' => 'throttle:30',
        'uses' => 'ReportController@Report'
    ]);
});

$app->group(['prefix' => 'Manage', 'middleware' => 'admin'], function () use ($app) {
    $app->get('/', function() {
        return view('admin');
    });

    $app->get('/Songs', 'ManageController@getSongs');
    $app->post('/Song/View', 'ManageController@viewSong');
    $app->post('/Song/Edit', 'ManageController@editSong');
    $app->post('/Song/Trash', 'ManageController@trashSongs');
    $app->get('/Songs/Trashed', 'ManageController@getTrashedSongs');
    $app->post('/Song/Restore', 'ManageController@restoreSongs');
    $app->post('/Song/Delete', ['middleware' => 'can:admin', 'uses' => 'ManageController@deleteSongs']);

    $app->get('/Files', 'ManageController@getFiles');
    $app->post('/File/Trash', 'ManageController@trashFiles');
    $app->get('/Files/Trashed', 'ManageController@getTrashedFiles');
    $app->post('/File/Restore', 'ManageController@restoreFiles');
    $app->post('/File/Delete', [
        'middleware' => 'can:admin',
        'uses' => 'ManageController@deleteFiles'
    ]);

    $app->get('/Reports', 'ManageController@getReports');
    $app->post('/Report/Delete', 'ManageController@deleteReports');

    $app->get('/Options', [
        'middleware' => 'can:admin',
        'uses' => 'ManageController@Options'
    ]);
    $app->post('/Option/Edit', [
        'middleware' => 'can:admin',
        'uses' => 'ManageController@editOption'
    ]);

    $app->get('/Votes', [
        'middleware' => 'can:admin',
        'uses' => 'ManageController@getVotes'
    ]);
    $app->get('/Rank', [
        'middleware' => 'can:admin',
        'uses' => 'ManageController@getRank'
    ]);
    $app->get('/Log', [
        'middleware' => 'can:admin',
        'uses' => 'ManageController@Log'
    ]);
});

$app->group(['prefix' => 'Music', 'middleware' => ['auth', 'throttle:40']], function () use ($app) {
    $app->post('/Search', 'MusicController@Search');
    $app->post('/Mp3', 'MusicController@Mp3');
    $app->get('/Playlist', 'MusicController@Playlist');
});
