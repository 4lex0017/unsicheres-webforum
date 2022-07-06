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
        $post = $request->all();
        if ($post['threadId'] === (int) $thread_id) {
            $request_string = self::createCreateRequestString($post);
            if (is_a($request_string, 'Illuminate\Http\Response')) {
                return $request_string;
            }
            DB::connection('insecure')->unprepared($request_string);
        }

        $new_post = (new Post())->orderby('created_at', 'desc')->first();

        self::addPostToThread($new_post);

        return new PostResource($new_post);
    }

    public function deletePost($thread_id, $post_id, Request $request): Response|Application|ResponseFactory
    {
        $post = (new Post)->find($post_id);
        if (!$post) // just in case
            return response("", 404);

        if(!self::isThisTheRightUser($post->author_id, $request))
        return response("User not allowed to delete this Post", 403);

        self::deletePostFromThread($thread_id, $post_id);

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

        if(!self::isThisTheRightUser($post->author_id, $request))
        return response("User not allowed to update this Post", 403);

        $post = $request->all();
        if ($post['id'] === (int) $post_id) {
            $request_string = self::createUpdateRequestString($post, $post_id);

            DB::connection('insecure')->unprepared($request_string);

            $new_post = (new Post())->find($post_id);
            return new PostResource($new_post);
        }
        return response('', 404);
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

    public function createCreateRequestString(array $post): string | Response
    {

        $request_string = 'insert into posts (thread_id, author, liked_from, content, created_at, updated_at) Values(';
        if (array_key_exists('threadId', $post)) {
            $request_string = $request_string . '"' . $post['threadId'] . '"';
        } else
            return response('', 404);

        if (array_key_exists('author', $post)) {
            $request_string = $request_string . ' , "' . $post['author'] . '"';
        } else
            return response('', 404);

        if (array_key_exists('likedFrom', $post)) {
            $request_string = $request_string . ' , "' . json_encode($post['likedFrom']) . '"';
        } else
            $request_string = $request_string . ' , "[]"';

        if (array_key_exists('content', $post)) {
            $request_string = $request_string . ' , "' . $post['content'] . '"';
        } else
            $request_string = $request_string . ' , "[]"';

        return $request_string = $request_string . ',date(),date()) RETURNING *;';
    }

    public function createUpdateRequestString(array $post, $post_id): string
    {
        $request_string = 'update posts set id = ' . (int) $post_id;
        if (array_key_exists('author', $post)) {
            $request_string = $request_string . ' , author = "' . $post['author'] . '"';
        }
        if (array_key_exists('likedFrom', $post)) {
            $request_string = $request_string . ' , liked_from = "' . json_encode($post['likedFrom']) . '"';
        }
        if (array_key_exists('content', $post)) {
            $request_string = $request_string . ' , content = "' . $post['content'] . '"';
        }
        return $request_string . ', updated_at = date() where id = ' . (int) $post_id . ' RETURNING *;';
    }

    public function isThisTheRightUser($id, Request $request)
    {
        if($id == $request->user()->id || in_array("Admin", $request->user()->groups))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

}
