<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LikeController extends Controller
{
    //
    public function likePost(Request $request, $thread_id, $post_id)
    {
        $user = json_decode($request->user(), true);
        $likedFrom = json_decode(DB::connection('insecure')
            ->table('posts')
            ->where('id', $post_id)
            ->value('liked_from'), true);
        if (in_array($user['id'], $likedFrom)) {
            $key = array_search($user['id'], $likedFrom);
            unset($likedFrom[$key]);
            $likedFrom = array_values($likedFrom);
        } else {
            $likedFrom[] = $user['id'];
        }
        DB::connection('insecure')
            ->table('posts')
            ->where('id', $post_id)
            ->update(['liked_from' => json_encode($likedFrom)]);
    }

    public function likeThread(Request $request, $thread_id)
    {
        $user = json_decode($request->user(), true);
        $likedFrom = json_decode(DB::connection('insecure')
            ->table('threads')
            ->where('id', $thread_id)
            ->value('liked_from'), true);
        if (in_array($user['id'], $likedFrom)) {
            $key = array_search($user['id'], $likedFrom);
            unset($likedFrom[$key]);
            $likedFrom = array_values($likedFrom);
        } else {
            $likedFrom[] = $user['id'];
        }
        DB::connection('insecure')
            ->table('threads')
            ->where('id', $thread_id)
            ->update(['liked_from' => json_encode($likedFrom)]);
    }
}
