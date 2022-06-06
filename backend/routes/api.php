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

Route::get('user/small', 'App\Http\Controllers\UserController@getSmallUsers');

Route::get('user', 'App\Http\Controllers\UserController@getAllUsers');

Route::get('user/{id}', 'App\Http\Controllers\UserController@getUserById');


Route::post('user', 'App\Http\Controllers\UserController@createUser');

Route::put('user/{id}', 'App\Http\Controllers\UserController@updateUser');
Route::get('user/{id}/post', 'App\Http\Controllers\PostController@getPostsOfUser');

Route::get('user/{id}/thread', 'App\Http\Controllers\ThreadController@getThreadOfUser');


Route::get('user/{id}/session', 'App\Http\Controllers\UserController@authorizeUser');


Route::get('thread/{thread_id}', 'App\Http\Controllers\ThreadController@getThreadById');

Route::post('thread', 'App\Http\Controllers\ThreadController@createThread');

Route::post('thread/{sub_id}/{thread_id}', 'App\Http\Controllers\ThreadController@getAllPostsOfThread');


Route::get('post/{id}', 'App\Http\Controllers\PostController@getPostById');
Route::get('posts', 'App\Http\Controllers\PostController@getAllPosts');
Route::post('/posts/threads/{thread_id}', 'App\Http\Controllers\PostController@createPost');


Route::get('search/{text}','App\Http\Controllers\SearchController@globalSearch');


Route::get('home', function () {
    return Category::all();
});

Route::get('home/{sub_id}', function ($sub_id) {
    return Category::findSubforum($sub_id);
});
