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
use Illuminate\Support\Facades\Log;
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

    /**
     * gets all Posts of User
     *
     * @param string|integer $id
     * @return AnonymousResourceCollection
     */
    public function getAllPostsOfUser(string|int $id): AnonymousResourceCollection
    {
        $posts = DB::connection('insecure')->table('posts')->select(
            '*'
        )->whereRaw("author = " . $id)->get();

        return SmallPostResource::collection($posts);
    }

    /**
     * Creates a Post (injectable)
     *
     * @param Request $request
     * @param string|integer $thread_id
     * @return PostResource|JsonResponse
     */
    public function createPost(Request $request, string|int $thread_id): PostResource|JsonResponse
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
        if ($post['threadId'] === (int)$thread_id)
            DB::connection('insecure')->unprepared(UtilityController::createStringBuilder('posts', self::$map, $request));

        $new_post = (new Post())->orderby('created_at', 'desc')->first();

        self::addPostToThread($new_post);

        return new PostResource($new_post);
    }

    /**
     * Deletes a Post (injectable)
     *
     * @param string|integer $thread_id
     * @param string|integer $post_id
     * @param Request $request
     * @return Response|Application|ResponseFactory
     */
    public function deletePost(string|int $thread_id, string|int $post_id, Request $request): Response|Application|ResponseFactory
    {
        $post = (new Post)->find($post_id);
        if (!$post) // just in case
            return response("", 404);

        if (!self::isThisTheRightUser($post->author_id, $request))
            return response("User not allowed to delete this Post", 403);

        self::deletePostFromThread($thread_id, $post_id);

        DB::connection('insecure')
            ->table('posts')
            ->whereRaw('id = ' . $post_id . ' and thread_id = ' . $thread_id)
            ->delete();

        return response("", 204);
    }

    /**
     * Updates a Post (injectable)
     *
     * @param Request $request
     * @param string|integer $thread_id
     * @param string|integer $post_id
     * @return PostResource|JsonResponse
     */
    public function updatePost(Request $request, string|int $thread_id, string|int $post_id): PostResource|JsonResponse
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
            return response()->json('!$post || $post->id != $post_id || $post->thread_id != $thread_id', 422);

        if (!self::isThisTheRightUser($post->author_id, $request))
            return response()->json('You are not allowed to edit this post!', 403);

        $post = $request->all();
        if ($post['id'] === (int)$post_id) {
            $request_string = UtilityController::updateStringBuilder('posts', self::$map, $request, $post_id);

            DB::connection('insecure')->unprepared($request_string);

            $new_post = (new Post())->find($post_id);

            return new PostResource($new_post);
        }

        return response()->json('end of function error', 422);
    }

    /**
     * Adds Post to Thread
     *
     * @param Post $post
     * @return void
     */
    private function addPostToThread(Post $post): void
    {
        // need to add the post to the threads' table post-array
        $thread = (new Thread)->find($post->thread_id);
        $posts_array = $thread['posts'];

        $posts_array[] = $post->id; // add new post ID to the posts

        $thread['posts'] = $posts_array;
        $thread->save();
    }

    /**
     * Deletes Post form Thread
     *
     * @param string|integer $thread_id
     * @param string|integer $post_id
     * @return void
     */
    private function deletePostFromThread(string|int $thread_id, string|int $post_id): void
    {
        // need to remove the post from the threads' table post-array
        $thread = (new Thread)->find($thread_id);
        $posts_array = $thread['posts'];

        // find the thread in the array by value and get rid of it
        array_splice($posts_array, array_search($post_id, $posts_array), 1);

        $thread['posts'] = $posts_array; // set the new array
        $thread->save(); // save it
    }

    /**
     * check if User is Allowed
     *
     * @param string|integer $id
     * @param Request $request
     * @return boolean
     */
    public function isThisTheRightUser(string|int $id, Request $request): bool
    {
        return $id == $request->user()->id || in_array("Admin", $request->user()->groups);
    }
}
