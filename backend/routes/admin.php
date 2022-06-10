<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('config', function () {
    return Admin::getConfiguration();
});

Route::get('scoreboard', function () {
    return Admin::getScoreboard();
});

Route::post('config', function (Request $request) {
    return Admin::startServerWithConfig($request);
});

Route::put('config', function (Request $request) {
    return Admin::updateConfiguration($request);
});
