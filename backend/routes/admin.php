<?php

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

/**
 * @uses App\Http\Controllers\AdminController::getSupportedVulnerabilities()
 */
Route::get('', 'App\Http\Controllers\AdminController@getSupportedVulnerabilities');

/**
 * @uses App\Http\Controllers\AdminController::getConfiguration()
 */
Route::get('config', 'App\Http\Controllers\AdminController@getConfiguration');

/**
 * @uses App\Http\Controllers\AdminController::updateConfiguration()
 */
Route::put('config', 'App\Http\Controllers\AdminController@updateConfiguration');

/**
 * @uses App\Http\Controllers\AdminController::resetDatabase()
 */
Route::post('reset/db', 'App\Http\Controllers\AdminController@resetDatabase');

/**
 * @uses App\Http\Controllers\AdminController::resetScoreboard()
 */
Route::post('reset/scoreboard', 'App\Http\Controllers\AdminController@resetScoreboard');

/**
 * @uses App\Http\Controllers\AdminController::getScoreboard()
 */
Route::get('scoreboard', 'App\Http\Controllers\AdminController@getScoreboard');


Route::post('register', 'App\Http\Controllers\AdminLoginController@register');

Route::post('login', 'App\Http\Controllers\AdminLoginController@login');

Route::middleware(['auth:sanctum','ability:isAdmin'])->group(function () {

    Route::post('logout', 'App\Http\Controllers\AdminLoginController@logout');
});