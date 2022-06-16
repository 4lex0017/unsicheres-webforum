<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;


class CategoryController extends Controller
{
    public function getAllCategories(): JsonResponse
    {
        $categories = DB::connection('insecure')
            ->table('categories')
            ->select('categories.id', 'categories.title', 'categories.threads')
            ->get()->toArray();

        $category_array = array();

        foreach ($categories as $category) {
            $category_threads = json_decode($category->threads);

            $threads = DB::connection('insecure')
                ->table('threads')
                ->join('users', 'users.id', '=', 'threads.author')
                ->select('threads.id', 'threads.title', 'threads.liked_from', 'threads.posts', 'threads.author',
                    'users.profile_picture', 'users.name')
                ->whereIn('threads.id', $category_threads)
                ->get()->toArray();

            $thread_array = ThreadController::buildSmallThreadArray($threads);

            $tmp_category = [
                'id' => $category->id,
                'title' => $category->title,
                'threads' => $thread_array
            ];

            $category_array[] = $tmp_category;
        }

        return response()->json(['categories' => $category_array])->setStatusCode(200);
    }

    public function getThreadsOfCategory($id): JsonResponse
    {
        $threads = DB::connection('insecure')
            ->table('threads')
            ->join('users', 'users.id', '=', 'threads.author')
            ->select('threads.id', 'threads.title', 'threads.liked_from',
                'threads.posts', 'threads.author', 'users.profile_picture', 'users.name')
            ->where('threads.category_id', '=', $id)
            ->get()->toArray();

        if (count($threads) === 0)
            return response()->json()->setStatusCode(404);

        return response()->json(['threads' => ThreadController::buildSmallThreadArray($threads)])
            ->setStatusCode(200);
    }
}
