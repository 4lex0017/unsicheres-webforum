<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Models\Post;

class PostController extends Controller
{
    public function getAllPostsOfUser($user_id)
    {
        return PostResource::collection(Post::where('user:id', $user_id));
    }

    public function getAllPostsOfThread($thread_id)
    {
        return PostResource::collection(Post::where('user:id', $thread_id));
    }
}
