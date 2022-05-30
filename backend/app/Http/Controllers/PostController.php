<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Support\Facades\DB;


class PostController extends Controller
{
    public function getAllPostsOfUser($user_id)
    {
        if (true) {
            return PostController::injectable('user_id', $user_id);
        }
        return PostResource::collection(Post::where('user_id', $user_id));
    }

    public function getAllPostsOfThread($thread_id)
    {
        return PostResource::collection(Post::where('user_id', $thread_id));
    }

    public function injectable($row, $id)
    {
        return DB::table('posts')->select(
            'post_id',
            'poster_id',
            'edit_history',
            'vote_count',
            'post_title',
            'post_text',
            'relative_post_id'
        )->whereRaw($row . " = " . $id)->get();
    }
}
