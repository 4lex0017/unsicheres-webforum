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

        $posts = DB::connection('insecure')->select(DB::raw(
            'SELECT
                    p.id,
                    p.content,
                    t.title
                   FROM posts as p
                   INNER JOIN threads t on t.id = p.thread_id
                   WHERE p.content LIKE \'%' . $text . '%\';'
        ));

        return [
            'users' => $users,
            'threads' => $threads,
            'posts' => $posts
        ];
    }
}
