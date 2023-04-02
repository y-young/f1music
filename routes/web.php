<?php

use App\Http\Controllers\AuthController;

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::prefix('/manage')->middleware('admin')->group(function () {
    Route::get('/', function () {
        return view('admin');
    });
    Route::get('{path}', function () {
        return view('admin');
    })->where('path', '.*');
});

Route::get('/', function () {
    return view('index');
});

Route::get('/{path}', function () {
    return view('index');
})->where('path', '.*');