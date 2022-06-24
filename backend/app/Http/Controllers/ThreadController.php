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

        return ThreadResource::collection($thread);
    }

    public function getAllThreadsOfUser($id): AnonymousResourceCollection
    {
        $threads = ThreadController::injectableWhere('author', $id);

        return SmallThreadResource::collection($threads);
    }

    public function createThread(Request $request, $category_id): ThreadResource
    {
        $json = $request->json();
        $json->add(['category_id' => $category_id]);

        $request->setJson($json);

        // need to add the thread to the categories' table thread-array
        $category = (new Category())->find($category_id);
        $thread_array = $category['threads'];

        $new_thread = (new Thread)->create($request->all());

        $thread_array[] = $new_thread->id;

        $category['threads'] = $thread_array;
        $category->save();

        $new_thread->liked_from = "[]"; // fix for null, frontend needs an empty array

        return new ThreadResource($new_thread);
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
            ->where('category_id', '=', $cat_id)->first();

        if (!$thread || $thread->id != $thread_id || $thread->category_id != $cat_id)
            return response('', 404);

        $new_title = $request->json('title');
        $thread['title'] = $new_title;

        $thread->save();

        return [
            "title" => $thread->title // this is all the frontend needs
        ];
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
}
