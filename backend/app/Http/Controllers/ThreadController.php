<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Http\Resources\ThreadResource;
use Illuminate\Http\Request;
use App\Models\Thread;
use Illuminate\Support\Facades\DB;


class ThreadController extends Controller
{
    public function getAllTrheads()
    {
        return ThreadResource::collection(Thread::all());
    }

    public function getThreadById($thread_id)
    {
        return new ThreadResource(ThreadController::injectebleWhere('id', $thread_id));
    }

    public function createThread(Request $request)
    {
        return Thread::create($request->all());
    }

    public function getThreadOfUser($id)
    {
        return ThreadResource::collection(ThreadController::threadOfUser($id));
    }

    public function threadOfUser($id)
    {
        return new ThreadResource(ThreadController::injectebleWhere('author', $id));
    }

    public function findThread($thread_id)
    {
        return ThreadController::injectebleWhere('id', $thread_id);
    }

    public function getAllPostsOfThread($thread_id)
    {
        return PostResource::collection(ThreadController::injectebleWherePost('id', $thread_id));
    }

    public static function injectebleWhere($row, $id)
    {
        return DB::connection('insecure')->table('threads')->select(
            '*'
        )->whereRaw($row . " = " . $id)->get();
    }

    public static function injectebleWherePost($row, $id)
    {
        return DB::connection('insecure')->table('threads')->select(
            'posts'
        )->whereRaw($row . " = " . $id)->get();
    }
}
