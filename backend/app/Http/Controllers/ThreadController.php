<?php

namespace App\Http\Controllers;

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
        return ThreadController::injectebleWhere('thread_id', $thread_id);
        return new ThreadResource(ThreadController::findThread($thread_id));
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
        return Thread::where('author', $id)->get();
    }

    public function findThread($thread_id)
    {
        return Thread::where('thread_id', $thread_id)->first();
    }

    public function getAllPostsOfThread($thread_id)
    {
        if (true) {
            return ThreadController::injectebleWherePost('id', $thread_id);
        }
    }

    public static function injectebleWhere($row, $id)
    {
        return DB::connection('insecure')->table('threads')->select(
            'id',
            'title',
            'liked_from',
            'author',
            'posts'
        )->whereRaw($row . " = " . $id)->get();
    }

    public static function injectebleWherePost($row, $id)
    {
        return DB::connection('insecure')->table('threads')->select(
            'posts'
        )->whereRaw($row . " = " . $id)->get();
    }
}
