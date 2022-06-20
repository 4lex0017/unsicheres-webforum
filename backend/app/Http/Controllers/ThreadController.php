<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Http\Resources\ThreadResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Thread;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;



class ThreadController extends Controller
{
    public function getAllSmallThreads(): JsonResponse
    {
        $data = self::buildSmallThreadArray(self::queryAllSmallThreads());

        return response()->json(['threads' => $data])->setStatusCode(200);
    }

    public function getAllTrheads()
    {
        return ThreadResource::collection(Thread::all());
    }

    public function getThreadById($thread_id)
    {
        return new ThreadResource(ThreadController::injectebleWhere('id', $thread_id));
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
        $thread = self::injectebleWhere('thread_id', $thread_id);
        if (!$thread)
            return response('', 404);

        if ($thread->id == $thread_id) {
            $thread->update($request->all());
            $thread->save();

            return new PostResource($thread);
        }
        return response('', 404);
    }

    public function getThreadOfUser($id)
    {
        return ThreadResource::collection(ThreadController::threadOfUser($id));
    }

    public function threadOfUser($id)
    {
        return new ThreadResource(ThreadController::injectebleWhere('author', $id));
    }

    public function findThread($thread_id)
    {
        return ThreadController::injectebleWhere('id', $thread_id);
    }

    public function getAllPostsOfThread($thread_id)
    {
        return PostResource::collection(ThreadController::injectebleWherePost('id', $thread_id));
    }

    public static function injectebleWhere($row, $id)
    {
        return DB::connection('insecure')->table('threads')->select(
            '*'
        )->whereRaw($row . " = " . $id)->get();
    }

    public static function injectebleWherePost($row, $id)
    {
        return DB::connection('insecure')->table('threads')->select(
            'posts'
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
