<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller
{
    public function getAllPostsOfUser($user_id)
    {
        return Post::getPostsOfUser($user_id);
    }

    public function getAllPostsOfThread($sub_id, $thread_id, Request $request)
    {
        Post::createAnswer($sub_id, $thread_id, $request->all);
    }
}
