<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Thread;
use Illuminate\Support\Facades\DB;

class ThreadController extends Controller
{
    public function getAllTrheads()
    {
        return Thread::all();
    }

    public function getThreadById($thread_id)
    {
        return Thread::findThread($thread_id);
    }

    public function getThreadBySearch(Request $search)
    {
        return Thread::all($search);
    }

    public function createThread($sub_id, Request $request)
    {
        return Thread::createThread($sub_id, $request->all);
    }

    public function getThreadOfUser($id)
    {
        return ThreadController::threadOfUser($id);
    }

    public function threadOfUser($id)
    {
        return DB::table('thread')->where('poster_id', '$id');
    }

    public function findThread($sub_id, $thread_id)
    {
        return DB::table('thread')->where('thread_id', '$id');
    }
}
