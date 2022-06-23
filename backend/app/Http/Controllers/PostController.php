<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Http\Resources\SmallPostResource;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class PostController extends Controller
{
    public function getAllPostsOfUser($id): AnonymousResourceCollection
    {
        $posts = DB::connection('insecure')->table('posts')->select(
            '*'
        )->whereRaw("author = " . $id)->get();

        return SmallPostResource::collection($posts);
    }

    public function createPost(Request $request, $thread_id)
    {
        $json = $request->json();
        $json->add(['thread_id' => $thread_id]);

        $request->setJson($json);

        return Post::create($request->all());
    }

    public function deletePost($thread_id, $post_id)
    {
        DB::connection('insecure')->table('posts')->whereRaw('id = ' . $post_id . ' and thread_id = ' . $thread_id)->delete();
        return response("", 204);
    }

    public function updatePost(Request $request, $thread_id, $post_id)
    {
        $post = self::injectableWhere('id', $post_id, 'thread_id', $thread_id);
        Log::debug(print_r($post, true));
        if (count($post) === 0) {
            return response('', 404);
        }
        $postw = $post->first();
        if ($postw->id == $post_id && $postw->thread_id == $thread_id) {
            $postw->update($request->all());
            $postw->save();

            return new PostResource($post);
        }
        return response('', 404);
    }

    public function injectableWhere($row, $id, $row2, $id2): Collection
    {
        return (new Post)->select(
            '*'
        )->whereRaw($row . " = " . $id . " and " . $row2 . " = " . $id2)->get();
    }
}
