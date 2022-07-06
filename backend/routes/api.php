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
 * @uses App\Http\Controllers\SearchController::searchUsers()
 */
Route::get('search/users', 'App\Http\Controllers\SearchController@searchUsers');

/**
 * @uses App\Http\Controllers\SearchController::searchPosts()
 */
Route::get('search/posts', 'App\Http\Controllers\SearchController@searchPosts');

/**
 * @uses App\Http\Controllers\SearchController::searchThreads()
 */
Route::get('search/threads', 'App\Http\Controllers\SearchController@searchThreads');

/**
 * @uses App\Http\Controllers\SearchController::globalSearch()
 */
Route::get('search', 'App\Http\Controllers\SearchController@globalSearch');

/**
 * @uses App\Http\Controllers\UserController::getUserById()
 */
Route::get('users/{id}', 'App\Http\Controllers\UserController@getUserById');

/**
 * @uses App\Http\Controllers\ThreadController::getAllThreadsOfUser()
 */
Route::get('users/{id}/threads', 'App\Http\Controllers\ThreadController@getAllThreadsOfUser');

/**
 * @uses App\Http\Controllers\PostController::getAllPostsOfUser()
 */
Route::get('users/{id}/posts', 'App\Http\Controllers\PostController@getAllPostsOfUser');

/**
 * @uses App\Http\Controllers\SiteController::getSmallUsers()
 */
Route::get('sitecontent/users', 'App\Http\Controllers\SiteController@getSmallUsers');

/**
 * @uses App\Http\Controllers\ThreadController::getAllSmallThreads()
 */
Route::get('threads/small', 'App\Http\Controllers\ThreadController@getAllSmallThreads');

/**
 * @uses App\Http\Controllers\ThreadController::getThreadById()
 */
Route::get('threads/{id}', 'App\Http\Controllers\ThreadController@getThreadById');

/**
 * @uses App\Http\Controllers\CategoryController::getAllCategories()
 */
Route::get('categories', 'App\Http\Controllers\CategoryController@getAllCategories');

/**
 * @uses App\Http\Controllers\CategoryController::getCategoryById()
 */
Route::get('categories/{id}', 'App\Http\Controllers\CategoryController@getCategoryById');

/**
 * @uses App\Http\Controllers\UserLoginController::register()
 */
Route::post('register', 'App\Http\Controllers\UserLoginController@register');

/**
 * @uses App\Http\Controllers\UserLoginController::login()
 */
Route::post('login', ['as' => 'login', 'uses' => 'App\Http\Controllers\UserLoginController@login']);

/**
 * @uses App\Http\Controllers\AdminLoginController::login()
 */
Route::post('/admin/login', ['as' => 'login', 'uses' => 'App\Http\Controllers\AdminLoginController@login']);
/**
 * @uses App\Http\Controllers\AdminController::putAttackerName()
 */
Route::put('attackername', 'App\Http\Controllers\AdminController@putAttackerName');

/**
 * @uses App\Http\Controllers\ProfileCommentController::getAllCommentsOfProfile()
 */
Route::get('profileComments/{profile_id}', 'App\Http\Controllers\ProfileCommentController@getAllCommentsOfProfile');

/**
 * @uses \App\Http\Controllers\AdminController::getSingleRoute()
 */
Route::get('/c', 'App\Http\Controllers\AdminController@getSingleRoute');

// Routegruppe für nur authenticated User state
Route::group(['middleware' => ['auth:sanctum']], function () {
    /**
     * @uses App\Http\Controllers\UserLoginController::logout()
     */
    Route::post('logout', 'App\Http\Controllers\UserLoginController@logout');

    /**
     * @uses App\Http\Controllers\UserController::updateUser()
     */
    Route::put('users/{id}', 'App\Http\Controllers\UserController@updateUser');

    /**
     * @uses App\Http\Controllers\ThreadController::createThread()
     */
    Route::post('categories/{id}/threads', 'App\Http\Controllers\ThreadController@createThread');

    /**
     * @uses App\Http\Controllers\ThreadController::updateThread()
     */
    Route::put('categories/{cat_id}/threads/{thread_id}', 'App\Http\Controllers\ThreadController@updateThread');

    /**
     * @uses App\Http\Controllers\ThreadController::deleteThread()
     */
    Route::delete('categories/{cat_id}/threads/{thread_id}', 'App\Http\Controllers\ThreadController@deleteThread');

    /**
     * @uses App\Http\Controllers\LikeController::likeThread()
     */
    Route::put('threads/{thread_id}/like', 'App\Http\Controllers\LikeController@likeThread');

    /**
     * @uses App\Http\Controllers\PostController::createPost()
     */
    Route::post('/threads/{thread_id}/posts', 'App\Http\Controllers\PostController@createPost');

    /**
     * @uses App\Http\Controllers\PostController::updatePost()
     */
    Route::put('/threads/{thread_id}/posts/{post_id}', 'App\Http\Controllers\PostController@updatePost');

    /**
     * @uses App\Http\Controllers\PostController::deletePost()
     */
    Route::delete('/threads/{thread_id}/posts/{post_id}', 'App\Http\Controllers\PostController@deletePost');

    /**
     * @uses App\Http\Controllers\LikeController::likePost()
     */
    Route::put('threads/{thread_id}/posts/{post_id}/like', 'App\Http\Controllers\LikeController@likePost');

    /**
     * @uses App\Http\Controllers\ProfileCommentController::createProfileComment()
     */
    Route::post('profileComments/{profile_id}', 'App\Http\Controllers\ProfileCommentController@createProfileComment');
});
