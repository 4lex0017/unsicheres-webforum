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
use SQLite3;


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
            $request_string = 'insert into posts (thread_id, author, liked_from, content) Values(';
            if (array_key_exists('threadId', $post)) {
                $request_string = $request_string . '"' . $post['threadId'] . '"';
            } else
                return response('', 404);

            if (array_key_exists('author', $post)) {
                $request_string = $request_string . ' , "' . $post['author'] . '"';
            } else
                return response('', 404);

            if (array_key_exists('likedFrom', $post)) {
                $request_string = $request_string . ' , "' . $post['likedFrom'] . '"';
            } else
                $request_string = $request_string . ' , "[]"';

            if (array_key_exists('content', $post)) {
                $request_string = $request_string . ' , "' . $post['content'] . '"';
            } else
                $request_string = $request_string . ' , "[]"';

            $db = new SQLite3('/var/www/html/database/insecure.sqlite');
            $request_string = $request_string . ') RETURNING *;';
            $sqlres = $db->query($request_string);

            foreach ($this->sqlite_keywords as $keyword) {
                $included = stripos($request_string, $keyword);
                if ($included != false) {
                    $first = true;
                    $result = '[';
                    while ($row = $sqlres->fetchArray()) {
                        if ($first) {
                            $first = false;
                        } else {
                            $result = $result . ",";
                        }
                        $result = $result . json_encode($row);
                    }
                    $result = $result . ']';

                    return response($result);
                }
            }
            $result = '';
            $first = true;
            while ($row = $sqlres->fetchArray()) {
                if ($first) {
                    $first = false;
                } else {
                    $result = $result . ',';
                }
                $result = $result . json_encode($row);
            }
        }
        $new_post = json_decode($result);

        // need to add the post to the threads' table post-array
        $thread = (new Thread)->find($thread_id);
        $posts_array = $thread['posts'];

        $posts_array[] = $new_post->id; // add new post ID to the posts

        $thread['posts'] = $posts_array;
        $thread->save();

        return new PostResource($new_post);
    }

    public function deletePost($thread_id, $post_id): Response|Application|ResponseFactory
    {
        $post = (new Post)->find($post_id);
        if (!$post) // just in case
            return response("", 404);

        // need to remove the post from the threads' table post-array
        $thread = (new Thread)->find($thread_id);
        $posts_array = $thread['posts'];

        // find the thread in the array by value and get rid of it
        array_splice($posts_array, array_search($post_id, $posts_array), 1);

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


        $post = $request->all();
        if ($post['id'] === (int) $post_id) {
            $request_string = 'update posts set id = ' . (int) $post_id;
            if (array_key_exists('author', $post)) {
                $request_string = $request_string . ' , author = "' . $post['author'] . '"';
            }
            if (array_key_exists('likedFrom', $post)) {
                $request_string = $request_string . ' , liked_from = "' . $post['likedFrom'] . '"';
            }
            if (array_key_exists('content', $post)) {
                $request_string = $request_string . ' , content = "' . $post['content'] . '"';
            }

            $db = new SQLite3('/var/www/html/database/insecure.sqlite');
            $request_string = $request_string . ' where id = ' . (int) $post_id . ' RETURNING *;';
            $sqlres = $db->query($request_string);

            foreach ($this->sqlite_keywords as $keyword) {
                $included = stripos($request_string, $keyword);
                if ($included != false) {
                    $first = true;
                    $result = '[';
                    while ($row = $sqlres->fetchArray()) {
                        if ($first) {
                            $first = false;
                        } else {
                            $result = $result . ",";
                        }
                        $result = $result . json_encode($row);
                    }
                    $result = $result . ']';

                    return response($result);
                }
            }
            $result = '';
            $first = true;
            while ($row = $sqlres->fetchArray()) {
                if ($first) {
                    $first = false;
                } else {
                    $result = $result . ',';
                }
                $result = $result . json_encode($row);
            }
            $post = json_decode($result);
            $post->liked_from = json_decode($post->liked_from);
            return new PostResource($post);
        }
        return response('', 404);
    }
}
