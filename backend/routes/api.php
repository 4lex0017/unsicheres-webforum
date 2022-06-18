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
 * @uses App\Http\Controllers\SearchController::globalSearch()
 */
Route::get('search/{text}', 'App\Http\Controllers\SearchController@globalSearch');

/**
 * @uses App\Http\Controllers\UserController::getAllUsers()
 */
Route::get('user', 'App\Http\Controllers\UserController@getAllUsers');

/**
 * @uses App\Http\Controllers\UserController::getUserById()
 */
Route::get('user/{id}', 'App\Http\Controllers\UserController@getUserById');

/**
 * @uses App\Http\Controllers\UserController::createUser()
 */
Route::post('user', 'App\Http\Controllers\UserController@createUser');

/**
 * @uses App\Http\Controllers\UserController::updateUser()
 */
Route::put('user/{id}', 'App\Http\Controllers\UserController@updateUser');

/**
 * @uses App\Http\Controllers\SiteController::getSmallUsers()
 */
Route::get('sitecontent/users', 'App\Http\Controllers\SiteController@getSmallUsers');

/**
 * @uses App\Http\Controllers\ThreadController::getAllSmallThreads()
 */
Route::get('threads/small', 'App\Http\Controllers\ThreadController@getAllSmallThreads');

/**
 * @uses App\Http\Controllers\CategoryController::getAllCategories()
 */
Route::get('categories/', 'App\Http\Controllers\CategoryController@getAllCategories');

/**
 * @uses App\Http\Controllers\CategoryController::getCategoryById()
 */
Route::get('categories/{id}', 'App\Http\Controllers\CategoryController@getCategoryById');

/**
 * @uses App\Http\Controllers\CategoryController::getThreadsOfCategory()
 */
Route::get('categories/{id}/threads', 'App\Http\Controllers\CategoryController@getThreadsOfCategory');


Route::post('register', 'App\Http\Controllers\UserLoginController@register');
Route::post('login', 'App\Http\Controllers\UserLoginController@login');


Route::get('thread/{thread_id}', 'App\Http\Controllers\ThreadController@getThreadById');
Route::get('thread', 'App\Http\Controllers\ThreadController@getThreadById');

Route::post('thread', 'App\Http\Controllers\ThreadController@getAllTrheads');

Route::post('thread/{sub_id}/{thread_id}', 'App\Http\Controllers\ThreadController@getAllPostsOfThread');


Route::get('post/{id}', 'App\Http\Controllers\PostController@getPostById');
Route::get('posts', 'App\Http\Controllers\PostController@getAllPosts');
Route::post('/posts/threads/{thread_id}', 'App\Http\Controllers\PostController@createPost');




