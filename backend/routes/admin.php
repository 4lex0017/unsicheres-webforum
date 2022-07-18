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
 * @uses App\Http\Controllers\AdminLoginController::login()
 */
Route::post('login', 'App\Http\Controllers\AdminLoginController@login');

//Gruppe für nur Admin authenticated Routen
Route::middleware(['auth:sanctum', 'ability:isAdmin'])->group(function () {

    /**
     * @uses App\Http\Controllers\AdminController::getSupportedVulnerabilities()
     */
    Route::get('vulnerabilities', 'App\Http\Controllers\AdminController@getSupportedVulnerabilities');

    /**
     * @uses App\Http\Controllers\AdminController::getConfiguration()
     */
    Route::get('config', 'App\Http\Controllers\AdminController@getConfiguration');

    /**
     * @uses App\Http\Controllers\AdminController::updateConfiguration()
     */
    Route::put('config', 'App\Http\Controllers\AdminController@updateConfiguration');

    /**
     * @uses App\Http\Controllers\AdminController::updateConfigurationFromJson()
     */
    Route::put('config/premade', 'App\Http\Controllers\AdminController@updateConfigurationFromJson');

    /**
     * @uses App\Http\Controllers\AdminController::resetDatabase()
     */
    Route::post('reset/db', 'App\Http\Controllers\AdminController@resetDatabase');

    /**
     * @uses App\Http\Controllers\AdminController::resetScoreboard()
     */
    Route::post('reset/scoreboard', 'App\Http\Controllers\AdminController@resetScoreboard');

    /**
     * @uses database\seeders\HinweisSeeder::run()
     */
    Route::post('activatehints', 'App\Http\Controllers\HinweisController@seed');

    /**
     * @uses App\Http\Controllers\AdminController::getScoreboard()
     */
    Route::get('scoreboard', 'App\Http\Controllers\AdminController@getScoreboard');

    /**
     * @uses App\Http\Controllers\AdminLoginController::logout()
     */
    Route::post('logout', 'App\Http\Controllers\AdminLoginController@logout');
});
