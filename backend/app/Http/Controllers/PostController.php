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
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;


class PostController extends Controller
{
    protected static array $map = [
        'threadId' => 'thread_id',
        'content' => 'content',
        'likedFrom' => 'liked_from',
        'author' => 'author'
    ];

    public function getAllPostsOfUser($id): AnonymousResourceCollection
    {
        $posts = DB::connection('insecure')->table('posts')->select(
            '*'
        )->whereRaw("author = " . $id)->get();

        foreach ($this->sqlite_keywords as $keyword) {
            $included = stripos($id, $keyword);
            if ($included != false) {
                return response($posts);
            }
        }

        return SmallPostResource::collection($posts);
    }

    public function createPost(Request $request, $thread_id): PostResource
    {
        $validator = Validator::make($request->all(), [
            'threadId' => 'required',
            'content' => 'required|min:5',
            'author' => 'required',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json(['error' => $errors], 422);
        }

        $post = $request->all();
        if ($post['threadId'] === (int) $thread_id) {
            DB::connection('insecure')->unprepared(UtilityController::createStringBuilder('posts', self::$map, $request));
        }

        $new_post = (new Post())->orderby('created_at', 'desc')->first();

        self::addPostToThread($new_post);

        return new PostResource($new_post);
    }

    public function deletePost($thread_id, $post_id): Response|Application|ResponseFactory
    {
        $post = (new Post)->find($post_id);
        if (!$post) // just in case
            return response("", 404);

        self::deletePostFromThread($thread_id, $post_id);

        DB::connection('insecure')
            ->table('posts')
            ->whereRaw('id = ' . $post_id . ' and thread_id = ' . $thread_id)
            ->delete();

        return response("", 204);
    }

    public function updatePost(Request $request, $thread_id, $post_id): PostResource|JsonResponse|Application|ResponseFactory
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'threadId' => 'required',
            'content' => 'sometimes|required|min:5',
            'author' => 'sometimes|required',
            'likedFrom' => 'sometimes|required'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json(['error' => $errors], 422);
        }

        $post = (new Post)->where('id', '=', $post_id, 'and')
            ->where('thread_id', '=', $thread_id)->first();

        if (!$post || $post->id != $post_id || $post->thread_id != $thread_id)
            abort(422);


        $post = $request->all();
        if ($post['id'] === (int) $post_id) {
            $request_string = UtilityController::updateStringBuilder('posts', self::$map, $request, $post_id);

            DB::connection('insecure')->unprepared($request_string);

            $new_post = (new Post())->find($post_id);
            return new PostResource($new_post);
        }
        abort(422);
    }

    private function addPostToThread($post): void
    {
        // need to add the post to the threads' table post-array
        $thread = (new Thread)->find($post->thread_id);
        $posts_array = $thread['posts'];

        $posts_array[] = $post->id; // add new post ID to the posts

        $thread['posts'] = $posts_array;
        $thread->save();
    }

    private function deletePostFromThread($thread_id, $post_id): void
    {
        // need to remove the post from the threads' table post-array
        $thread = (new Thread)->find($thread_id);
        $posts_array = $thread['posts'];

        // find the thread in the array by value and get rid of it
        array_splice($posts_array, array_search($post_id, $posts_array), 1);

        $thread['posts'] = $posts_array; // set the new array
        $thread->save(); // save it    }
    }
}
