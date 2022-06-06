<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use JetBrains\PhpStorm\ArrayShape;

class SearchController extends Controller
{
    #[ArrayShape(['users' => "\Illuminate\Support\Collection", 'threads' => "\Illuminate\Support\Collection",
        'posts' => "\Illuminate\Support\Collection"])]
    public function globalSearch($text): array
    {
        return self::injectableSelectWhere($text);
    }

    #[ArrayShape(['users' => "\Illuminate\Support\Collection", 'threads' => "\Illuminate\Support\Collection",
        'posts' => "\Illuminate\Support\Collection"])]
    public static function injectableSelectWhere($text): array
    {
        $users = DB::connection('insecure')->table('users')->select(
            'id',
            'name'
        )->whereRaw('name LIKE \'%' . $text . '%\'')->get();

        $threads = DB::connection('insecure')->table('threads')->select(
            'id',
            'title'
        )->whereRaw('title LIKE \'%' . $text . '%\'')->get();

        $posts = DB::connection('insecure')->table('posts')->select(
            'id',
            'thread_id',
            'content'
        )->whereRaw('content LIKE \'%' . $text . '%\'')->get();

        return [
            'users' => $users,
            'threads' => $threads,
            'posts' => $posts
        ];
    }
}
