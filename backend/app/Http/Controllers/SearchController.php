<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SearchController extends Controller
{
    public function searchUsers(Request $request): JsonResponse|array
    {
        $q = $request->query('q');
        if (!$q)
            return response()->json()->setStatusCode(404);

        $users = DB::connection('insecure')->table('users')->select(
            'id',
            'name'
        )->whereRaw('name LIKE \'%' . $q . '%\'')->get();

        return [
            'users' => $users
        ];
    }

    public function searchPosts(Request $request): JsonResponse|array
    {
        $q = $request->query('q');
        if (!$q)
            return response()->json()->setStatusCode(404);

        $posts = DB::connection('insecure')->select(DB::raw(
            'SELECT
                    p.id,
                    p.content,
                    t.id as threadId
                   FROM posts as p
                   INNER JOIN threads t on t.id = p.thread_id
                   WHERE p.content LIKE \'%' . $q . '%\';'
        ));

        return [
            'posts' => $posts
        ];
    }

    public static function searchThreads(Request $request): JsonResponse|array
    {
        $q = $request->query('q');
        if (!$q)
            return response()->json()->setStatusCode(404);

        $threads = DB::connection('insecure')->table('threads')->select(
            'id',
            'title'
        )->whereRaw('title LIKE \'%' . $q . '%\'')->get();

        return [
            'threads' => $threads,
        ];
    }
}
