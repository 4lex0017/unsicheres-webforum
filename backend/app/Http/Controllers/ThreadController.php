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
    /**
     * Array for Creating and Updating a Thread
     *
     * @var array
     */
    protected static array $map = [
        'categoryId' => 'category_id',
        'title' => 'title',
        'likedFrom' => 'liked_from',
        'author' => 'author',
        'posts' => 'posts'
    ];

    /**
     * Gets a small representation of all Threads
     *
     * @return JsonResponse
     */
    public function getAllSmallThreads(): JsonResponse
    {
        $data = self::buildSmallThreadArray(self::queryAllSmallThreads());

        return response()->json(['threads' => $data])->setStatusCode(200);
    }

    /**
     * gets a Thread
     *
     * @param string|int $id
     * @return Response|AnonymousResourceCollection|Application|ResponseFactory
     */
    public function getThreadById($id): Response|AnonymousResourceCollection|Application|ResponseFactory
    {
        $thread = ThreadController::injectableWhere('id', $id);
        if (count($thread) === 0)
            return response('', 404);

        return ThreadResource::collection($thread);
    }

    /**
     * gets all Threads of User
     *
     * @param string|int $id
     * @return AnonymousResourceCollection
     */
    public function getAllThreadsOfUser($id): AnonymousResourceCollection
    {
        $threads = ThreadController::injectableWhere('author', $id);

        return SmallThreadResource::collection($threads);
    }

    /**
     * Creates Thread (injectable)
     *
     * @param Request $request
     * @param string|int $category_id
     * @return ThreadResource|JsonResponse
     */
    public function createThread(Request $request, string|int $category_id): ThreadResource|JsonResponse
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

        self::addThreadToCategory($new_thread, $category_id); // need to add the thread to the categories' table thread-array

        return new ThreadResource($new_thread);
    }

    /**
     * Deletes Thread (injectable)
     *
     * @param string|int $cat_id
     * @param string|int $thread_id
     * @param Request $request
     * @return Response|Application|ResponseFactory
     */
    public function deleteThread(string|int $cat_id, string|int $thread_id, Request $request): Response|Application|ResponseFactory
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

    /**
     * Updates Thread (Injectable)
     *
     * @param Request $request
     * @param string|int $cat_id
     * @param string|int $thread_id
     * @return JsonResponse|array|Application|ResponseFactory
     */
    public function updateThread(Request $request, string|int $cat_id, string|int $thread_id): JsonResponse|array|Application|ResponseFactory
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
        if ($thread['id'] === (int)$thread_id) {
            DB::connection('insecure')->unprepared(UtilityController::updateStringBuilder('threads', self::$map, $request, $thread_id));

            $thread = (new Thread())->find($thread_id);
            return [
                "title" => $thread->title // this is all the frontend needs
            ];
        }

        abort(400); // TODO: why the **** is this here
    }

    /**
     * Injectable SQL select where
     *
     * @param string|int $row
     * @param string|int $id
     * @return Collection
     */
    public static function injectableWhere(string|int $row, string|int $id): Collection
    {
        return DB::connection('insecure')->table('threads')->select(
            '*'
        )->whereRaw($row . " = " . $id)->get();
    }

    /**
     * Gets all small Threads
     *
     * @return array
     */
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

    /**
     * Adds Thread to Category
     *
     * @param Thread $thread
     * @param string|int $category_id
     * @return void
     */
    private function addThreadToCategory(Thread $thread, $category_id): void
    {
        $category = (new Category())->find($category_id);
        $thread_array = $category['threads'];
        $thread_array[] = $thread->id;
        $category['threads'] = $thread_array;
        $category->save();
    }

    /**
     * Deletes Thread from Category
     *
     * @param string|integer $cat_id
     * @param string|integer $thread_id
     * @return void
     */
    private function deleteThreadFromCategory(string|int $cat_id, string|int $thread_id): void
    {
        // need to remove the thread from the categories' table thread-array
        $category = (new Category())->find($cat_id);
        $thread_array = $category['threads'];

        // find the thread in the array by value and get rid of it
        array_splice($thread_array, array_search($thread_id, $thread_array), 1);

        $category['threads'] = $thread_array;
        $category->save();
    }

    /**
     * Creates small Thread array
     *
     * @param mixed $threads
     * @param boolean $firstFour
     * @return array
     */
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

    /**
     * Checks if user is allowed
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
