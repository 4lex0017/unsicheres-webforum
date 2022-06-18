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

        return $this->returnCategoryResponse($categories, true);
    }

    public function getCategoryById($id): JsonResponse
    {
        $categories = DB::connection('insecure')
            ->table('categories')
            ->select('categories.id', 'categories.title', 'categories.threads')
            ->where('categories.id', '=', $id)
            ->get()->toArray();

        if (count($categories) === 0)
            return response()->json()->setStatusCode(404);

        return $this->returnCategoryResponse($categories);
    }

    public function returnCategoryResponse(array $categories, bool $firstFour = false): JsonResponse
    {
        $category_array = array();

        foreach ($categories as $category) {
            $category_threads = json_decode($category->threads);

            $threads = DB::connection('insecure')
                ->table('threads')
                ->join('users', 'users.id', '=', 'threads.author')
                ->select('threads.id', 'threads.title', 'threads.liked_from', 'threads.posts', 'threads.author',
                    'users.profile_picture', 'users.name')
                ->whereIn('threads.id', $category_threads)
                ->orderBy('threads.updated_at')
                ->get()->toArray();

            $thread_array = ThreadController::buildSmallThreadArray($threads, $firstFour);

            $tmp_category = [
                'id' => $category->id,
                'title' => $category->title,
                'threads' => $thread_array
            ];

            $category_array[] = $tmp_category;
        }

        return response()->json(['categories' => $category_array])->setStatusCode(200);
    }
}
