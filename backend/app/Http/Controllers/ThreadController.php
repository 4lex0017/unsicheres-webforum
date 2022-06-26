<?php

namespace App\Http\Controllers;

use App\Http\Resources\SmallThreadResource;
use App\Http\Resources\ThreadResource;
use App\Models\Category;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Thread;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

use SQLite3;



class ThreadController extends Controller
{
    public function getAllSmallThreads(): JsonResponse
    {
        $data = self::buildSmallThreadArray(self::queryAllSmallThreads());

        return response()->json(['threads' => $data])->setStatusCode(200);
    }

    public function getThreadById($id): Response|AnonymousResourceCollection|Application|ResponseFactory
    {
        $thread = ThreadController::injectableWhere('id', $id);
        if (count($thread) === 0)
            return response('', 404);

        foreach ($this->sqlite_keywords as $keyword) {
            $included = stripos($id, $keyword);
            if ($included != false) {
                return response($thread);
            }
        }

        return ThreadResource::collection($thread);
    }

    public function getAllThreadsOfUser($id): AnonymousResourceCollection
    {
        $threads = ThreadController::injectableWhere('author', $id);

        return SmallThreadResource::collection($threads);
    }

    public function createThread(Request $request, $category_id): ThreadResource
    {
        $thread = $request->all();
        if ($thread['categoryId'] === (int) $category_id) {

            $request_string = self::createCreateRequestString($thread);

            if (is_a($request_string, 'Illuminate\Http\Response')) {
                return $request_string;
            }

            $db = new SQLite3('/var/www/html/database/insecure.sqlite');
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
            $new_thread = json_decode($result);
            $category = (new Category())->find($category_id);
            $thread_array = $category['threads'];
            $thread_array[] = $new_thread->id;
            $category['threads'] = $thread_array;
            $category->save();
            return new ThreadResource($new_thread);
        }
        return response('', 404);
        // need to add the thread to the categories' table thread-array
    }

    public function deleteThread($cat_id, $thread_id): Response|Application|ResponseFactory
    {
        $thread = (new Thread)->find($thread_id);
        if (!$thread) // just in case
            return response("", 404);

        // need to remove the thread from the categories' table thread-array
        $category = (new Category())->find($cat_id);
        $thread_array = $category['threads'];

        // find the thread in the array by value and get rid of it
        array_splice($thread_array, array_search($thread_id, $thread_array), 1);

        $category['threads'] = $thread_array;
        $category->save();

        DB::connection('insecure')
            ->table('threads')
            ->whereRaw('id = ' . $thread_id . ' and category_id = ' . $cat_id)
            ->delete();

        return response("", 204);
    }

    public function updateThread(Request $request, $cat_id, $thread_id): Response|array|Application|ResponseFactory
    {
        $thread = (new Thread)->where('id', '=', $thread_id, 'and')
            ->where('categoryId', '=', $cat_id)->first();

        if (!$thread || $thread->id != $thread_id || $thread->category_id != $cat_id)
            return response('', 404);

        $thread = $request->all();
        if ($thread['id'] === (int) $thread_id) {
            $request_string = self::createUpdateRequestString($thread, $thread_id);
            $db = new SQLite3('/var/www/html/database/insecure.sqlite');
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
            $thread = new ThreadResource(json_decode($result));
            return [
                "title" => $thread->title // this is all the frontend needs
            ];
        }
        return response('', 404);
    }

    public static function injectableWhere($row, $id): Collection
    {
        return DB::connection('insecure')->table('threads')->select(
            '*'
        )->whereRaw($row . " = " . $id)->get();
    }

    public static function queryAllSmallThreads(): array
    {
        return DB::connection('insecure')
            ->table('threads')
            ->join('users', 'users.id', '=', 'threads.author')
            ->select(
                'threads.id',
                'threads.title',
                'threads.liked_from',
                'threads.posts',
                'threads.author',
                'users.profile_picture',
                'users.name'
            )
            ->orderBy('threads.updated_at')
            ->get()->toArray();
    }

    public static function buildSmallThreadArray($threads, bool $firstFour = false): array
    {
        $thread_array = array();

        foreach ($threads as $thread) {
            if ($firstFour && count($thread_array) === 4)
                break;

            $tmp_author = [
                'id' => $thread->author,
                'profile_picture' => $thread->profile_picture,
                'name' => $thread->name,
            ];

            $tmp_thread = [
                'id' => $thread->id,
                'title' => $thread->title,
                'likedFrom' => json_decode($thread->liked_from),
                'numberOfPosts' => count(json_decode($thread->posts)),
                'author' => $tmp_author,
            ];

            $thread_array[] = $tmp_thread;
        }

        return $thread_array;
    }

    public function createCreateRequestString(array $thread)
    {
        $request_string = 'insert into threads (category_id, title, liked_from, author, posts) Values(';
        if (array_key_exists('categoryId', $thread)) {
            $request_string = $request_string . '"' . $thread['categoryId'] . '"';
        } else
            return response('', 404);

        if (array_key_exists('title', $thread)) {
            $request_string = $request_string . ', "' . $thread['title'] . '"';
        } else
            return response('', 404);

        if (array_key_exists('likedFrom', $thread)) {
            $request_string = $request_string . ' , "' . json_encode($thread['likedFrom']) . '"';
        } else
            $request_string = $request_string . ' , "[]"';

        if (array_key_exists('author', $thread)) {
            $request_string = $request_string . ' , "' . $thread['author'] . '"';
        } else
            return response('', 404);

        if (array_key_exists('posts', $thread)) {
            $request_string = $request_string . ' , "' . json_encode($thread['posts']) . '"';
        } else
            $request_string = $request_string . ' , "[]"';

        return $request_string = $request_string . ') RETURNING *;';
    }

    public function createUpdateRequestString(array $thread, $thread_id)
    {
        $request_string = 'update threads set id = ' . (int) $thread_id;
        if (array_key_exists('title', $thread)) {
            $request_string = $request_string . ', title = "' . $thread['title'] . '"';
        }
        if (array_key_exists('likedFrom', $thread)) {
            $request_string = $request_string . ' , liked_from = "' . json_encode($thread['likedFrom']) . '"';
        }
        if (array_key_exists('author', $thread)) {
            $request_string = $request_string . ' , author = "' . $thread['author'] . '"';
        }
        if (array_key_exists('posts', $thread)) {
            $request_string = $request_string . ' , posts = "' . json_encode($thread['posts']) . '"';
        }

        return $request_string . ', updated_at = date() where id = ' . (int) $thread_id . ' RETURNING *;';
    }
}
