<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MusicController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\ManageController;
use App\Http\Controllers\VoteController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::controller(AuthController::class)->prefix('/auth')->group(
    function () {
        Route::post('/login', 'login')->middleware('throttle:20');
        Route::post('/logout', 'logout');
        Route::get('/check', 'check');
    }
);

Route::get('/download/{id}', [
    ManageController::class,
    'download'
])->whereNumber('id')->middleware(['throttle:30', 'download']);

Route::get('/music/playlist', [MusicController::class, 'playlist'])->middleware('throttle:30');
Route::get('/status/{type}', [ManageController::class, 'getStatus'])->whereAlpha('type');

Route::middleware('auth')->group(function () {
    Route::controller(UploadController::class)->group(
        function () {
            Route::get('/uploads', 'uploads')->middleware('throttle:40');
            Route::post('/upload', 'upload')->middleware('throttle:30');
        }
    );
    Route::controller(VoteController::class)->prefix("/vote")->group(
        function () {
            Route::post('/list', 'getSongs')->middleware('throttle:30');
            Route::post('/', 'vote')->middleware('throttle:30');
        }
    );
    Route::controller(ReportController::class)->group(
        function () {
            Route::post('/report', 'report')->middleware('throttle:30');
        }
    );

    Route::prefix('/music')->controller(MusicController::class)->group(
        function () {
            Route::post('/search', 'search');
            Route::post('/mp3', 'mp3');
        }
    )->middleware('throttle:40');
});

Route::middleware('admin')->withoutMiddleware('throttle:api')->group(function () {
    Route::controller(ManageController::class)->group(
        function () {
            Route::prefix('/songs')->group(function () {
                Route::get('/', 'getSongs');
                Route::get('/{id}', 'viewSong')->whereNumber('id');
                Route::put('/', 'editSong');
                Route::post('/trash', 'trashSongs');
                Route::get('/trashed', 'getTrashedSongs');
                Route::post('/restore', 'restoreSongs');
            });

            Route::get('/files', 'getFiles');

            Route::prefix('/reports')->group(function () {
                Route::get('/', 'getReports');
                Route::delete('/', 'deleteReports');
            });

            Route::middleware('can:admin')->group(
                function () {
                        Route::delete('/songs', 'deleteSongs');
                        Route::get('/votes/rank', 'getRank');
                        Route::get('/votes/analyze', 'analyze');
                        Route::get('/statistics', 'statistics');
                    }
            );
        }
    );
});