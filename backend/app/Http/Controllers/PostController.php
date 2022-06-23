<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Http\Resources\SmallPostResource;
use App\Models\Post;
use App\Models\Thread;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;


class PostController extends Controller
{
    public function getAllPostsOfUser($id): AnonymousResourceCollection
    {
        $posts = DB::connection('insecure')->table('posts')->select(
            '*'
        )->whereRaw("author = " . $id)->get();

        return SmallPostResource::collection($posts);
    }

    public function createPost(Request $request, $thread_id): PostResource
    {
        $json = $request->json();
        $json->add(['thread_id' => $thread_id]);

        $request->setJson($json);

        // need to add the post to the threads' table post-array
        $thread = (new Thread)->find($thread_id);
        $posts_array = $thread['posts'];

        $new_post = (new Post)->create($request->all());

        $posts_array[] = $new_post->id; // add new post ID to the posts

        $thread['posts'] = $posts_array;
        $thread->save();

        return new PostResource($new_post);
    }

    public function deletePost($thread_id, $post_id): Response|Application|ResponseFactory
    {
        // need to remove the post from the threads' table post-array
        $thread = (new Thread)->find($thread_id);
        $posts_array = $thread['posts'];

        if (($key = array_search($post_id, $posts_array)) !== false) {
            unset($posts_array[$key]); // find the post_id value and unset it
        }

        $thread['posts'] = $posts_array; // set the new array
        $thread->save(); // save it

        DB::connection('insecure')
            ->table('posts')
            ->whereRaw('id = ' . $post_id . ' and thread_id = ' . $thread_id)
            ->delete();

        return response("", 204);
    }

    public function updatePost(Request $request, $thread_id, $post_id): PostResource|Response|Application|ResponseFactory
    {
        $post = (new Post)->where('id', '=', $post_id, 'and')
            ->where('thread_id', '=', $thread_id)->first();

        if (!$post || $post->id != $post_id || $post->thread_id != $thread_id)
            return response('', 404);

        $post->update($request->all());
        $post->save();

        return new PostResource($post);
    }
}
