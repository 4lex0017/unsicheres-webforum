<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;


class CategoryController extends Controller
{
    public function getAllCategories(): array
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

        return $category_array;
    }

    public function getThreadsOfCategory($id): array
    {
        $threads = DB::connection('insecure')
            ->table('threads')
            ->join('users', 'users.id', '=', 'threads.author')
            ->select('threads.id', 'threads.title', 'threads.liked_from',
                'threads.posts', 'threads.author', 'users.profile_picture', 'users.name')
            ->where('threads.category_id', '=', $id)
            ->get()->toArray();

        return ThreadController::buildSmallThreadArray($threads);
    }
}
