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

Route::get('user', 'App\Http\Controllers\UserController@getAllUsers');

Route::get('user/{id}', 'App\Http\Controllers\UserController@getUserById');


Route::post('user', 'App\Http\Controllers\UserController@createUser');

Route::put('user/{id}', 'App\Http\Controllers\UserController@updateUser');
Route::get('user/{id}/post', 'App\Http\Controllers\PostController@getPostsOfUser');

Route::get('user/{id}/thread', 'App\Http\Controllers\ThreadController@getThreadOfUser');


Route::get('user/{id}/session', 'App\Http\Controllers\UserController@authorizeUser');


Route::get('thread/{sub_id}/{thread_id}', 'App\Http\Controllers\ThreadController@getThreadById');

Route::get('thread/search', "App\Http\Controllers\ThreadController@getThreadBySearch");

Route::post('thread/{sub_id}', 'App\Http\Controllers\ThreadController@createThread');

Route::post('thread/{sub_id}/{thread_id}', 'App\Http\Controllers\PostController@getAllPostsOfThread');


Route::get('home', function () {
    return Category::all();
});

Route::get('home/{sub_id}', function ($sub_id) {
    return Category::findSubforum($sub_id);
});

Route::get('admin', function () {
    return Admin::getConfiguration();
});

Route::get('admin/scoreboard', function () {
    return Admin::getScoreboard();
});

Route::post('admin', function (Request $request) {
    return Admin::startServerWithConfig($request);
});

Route::put('admin', function (Request $request) {
    return Admin::updateConfiguration($request);
});
