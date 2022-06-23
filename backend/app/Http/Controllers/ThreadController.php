<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
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

    public function deleteThread($thread_id)
    {
        $thread = Thread::find($thread_id)->first();

        $category_id = $thread->category_id;

        $category = (new Category)->where('id', $category_id)->first();

        $threads = $category->threads;
        $key = array_search($thread_id, $threads);
        array_splice($threads, 1, $key);
        $category->threads = $threads;
        $category->save();
        DB::connection('insecure')->table('threads')->whereRaw('id = ' . $thread_id)->delete();
        return response("", 204);
    }

    public function postThreadToCategory(Request $request, $category_id)
    {
        $thread = $request->all();
        $thread['category_id'] = $category_id;
        $model = (new Thread)->create($thread);

        $category = (new Category)->where('id', $category_id)->first();

        $category->threads[] = $model->id;

        $category->update();

        return response()->json(['data' => ['id' => $model->id]])->setStatusCode(201);
    }

    public function updateThread(Request $request, $thread_id)
    {
        $thread = self::injectableWhere('thread_id', $thread_id);
        if (!$thread)
            return response('', 404);

        if ($thread->id == $thread_id) {
            $thread->update($request->all());
            $thread->save();

            return new PostResource($thread);
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
}
