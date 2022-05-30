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
        return ThreadController::injectable('thread_id', $thread_id);
        return new ThreadResource(ThreadController::findThread($thread_id));
    }

    public function getThreadBySearch(Request $search)
    {
        //TODO:
        return Thread::all($search);
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
        return Thread::where('poster_id', $id)->get();
    }

    public function findThread($thread_id)
    {
        return Thread::where('thread_id', $thread_id)->first();
    }

    public function injectable($row, $id)
    {
        return DB::connection('insecure')->table('threads')->select(
            'thread_id',
            'poster_id',
            'thread_title',
            'tags',
            'thread_prefix',
            'posts'
        )->whereRaw($row . " = " . $id)->get();
    }
}
