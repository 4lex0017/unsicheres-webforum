<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;


class PostController extends Controller
{
    public function getAllPostsOfUser($author): Collection
    {
        if (true) {
            return PostController::injectableWhere('author', $author);
        }
        return PostResource::collection(Post::where('author', $author));
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
