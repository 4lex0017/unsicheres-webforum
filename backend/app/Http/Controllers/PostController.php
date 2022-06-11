<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class PostController extends Controller
{
    public function getAllPosts()
    {
        return PostResource::collection(Post::all());
    }

    public function getPostById($id)
    {
        return PostController::injectableWhere('id', $id);
    }

    public function createPost(Request $request, $thread_id)
    {
        $json = $request->json();
        $json->add(['thread_id' => $thread_id]);

        $request->setJson($json);

        return Post::create($request->all());
    }

    public function getAllPostsOfUser($author): Collection
    {
        return PostController::injectableWhere('author', $author);
    }

    public function injectableWhere($row, $id): Collection
    {
        return DB::connection('insecure')->table('posts')->select(
            'id',
            'user_id',
            'content',
            'created_at',
            'liked_from',
            'author'
        )->whereRaw($row . " = " . $id)->get();
    }
}
