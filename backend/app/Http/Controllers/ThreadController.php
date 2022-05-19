<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Thread;

class ThreadController extends Controller
{
    public function getAllTrheads()
    {
        return Thread::all();
    }

    public function getThreadById($sub_id, $thread_id)
    {
        return Thread::findThread($sub_id, $thread_id);
    }

    public function getThreadBySearch(Request $search)
    {
        return Thread::all($search);
    }

    public function createThread($sub_id, Request $request)
    {
        return Thread::createThread($sub_id, $request->all);
    }
}
