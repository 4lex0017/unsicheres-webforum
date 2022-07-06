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
use Illuminate\Support\Facades\Validator;




class ThreadController extends Controller
{
    protected static array $map = [
        'categoryId' => 'category_id',
        'title' => 'title',
        'likedFrom' => 'liked_from',
        'author' => 'author',
        'posts' => 'posts'
    ];


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
        $validator = Validator::make($request->all(), [
            'categoryId' => 'required',
            'title' => 'required|min:5',
            'author' => 'required'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json(['error' => $errors], 422);
        }

        DB::connection('insecure')->unprepared(UtilityController::createStringBuilder('threads', self::$map, $request));
        $new_thread = (new Thread())->orderby('created_at', 'desc')->first();

        self::addThreadToCategory($new_thread, $category_id);

        return new ThreadResource($new_thread);
        // need to add the thread to the categories' table thread-array
    }

    public function deleteThread($cat_id, $thread_id, Request $request): Response|Application|ResponseFactory
    {
        $thread = (new Thread)->find($thread_id);
        if (!$thread) // just in case
            return response("", 404);

        if (!self::isThisTheRightUser($thread->author_id, $request))
            return response("User not allowed to delete this Thread", 403);

        self::deleteThreadFromCategory($cat_id, $thread_id);

        DB::connection('insecure')
            ->table('threads')
            ->whereRaw('id = ' . $thread_id . ' and category_id = ' . $cat_id)
            ->delete();

        return response("", 204);
    }

    public function updateThread(Request $request, $cat_id, $thread_id): JsonResponse|array|Application|ResponseFactory
    {
        $validator = Validator::make($request->all(), [
            'categoryId' => 'required',
            'id' => 'required',
            'title' => 'sometimes|required|min:5',
            'author' => 'sometimes|required',
            'likedFrom' => 'sometimes|required',
            'posts' => 'sometimes|required'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json(['error' => $errors], 422);
        }

        $thread = (new Thread)->where('id', '=', $thread_id, 'and')
            ->where('category_id', '=', $cat_id)->first();

        if (!$thread || $thread->id != $thread_id || $thread->category_id != $cat_id)
            abort(422);

        if (!self::isThisTheRightUser($thread->author_id, $request))
            return response("User not allowed to update this Thread", 403);

        $thread = $request->all();
        if ($thread['id'] === (int) $thread_id) {
            DB::connection('insecure')->unprepared(UtilityController::updateStringBuilder('threads', self::$map, $request, $thread_id));

            $thread = (new Thread())->find($thread_id);
            return [
                "title" => $thread->title // this is all the frontend needs
            ];
        }
        abort(400);
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

    private function addThreadToCategory($thread, $category_id): void
    {
        $category = (new Category())->find($category_id);
        $thread_array = $category['threads'];
        $thread_array[] = $thread->id;
        $category['threads'] = $thread_array;
        $category->save();
    }

    private function deleteThreadFromCategory($cat_id, $thread_id): void
    {
        // need to remove the thread from the categories' table thread-array
        $category = (new Category())->find($cat_id);
        $thread_array = $category['threads'];

        // find the thread in the array by value and get rid of it
        array_splice($thread_array, array_search($thread_id, $thread_array), 1);

        $category['threads'] = $thread_array;
        $category->save();
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

    public function isThisTheRightUser($id, Request $request)
    {
        return $id == $request->user()->id || in_array("Admin", $request->user()->groups);
    }
}
