<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\ThreadResource;
use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class CategoryController extends Controller
{
    public function getAllCategorys()
    {
        return CategoryResource::collection(Category::all());
    }

    public function getCategoryById($category_id)
    {
        return CategoryController::injectableWhere('id', $category_id);
    }

    public function getThreadsOfCategory($category_id)
    {
        return ThreadResource::collection(ThreadController::injectebleWhere('category_id', $category_id));
    }

    public function createCategory(Request $request)
    {
        return Category::create($request->all());
    }

    public function injectableWhere($row, $id): Collection
    {
        return DB::connection('insecure')->table('categorys')->select(
            '*'
        )->whereRaw($row . " = " . $id)->get();
    }
}
