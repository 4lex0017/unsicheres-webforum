<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class PostController extends Controller
{

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
        if (!$post)
            return response('', 404);

        if ($post->id == $post_id && $post->thread_id == $thread_id) {
            $post->update($request->all());
            $post->save();

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
