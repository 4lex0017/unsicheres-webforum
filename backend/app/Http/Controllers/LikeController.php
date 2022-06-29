<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LikeController extends Controller
{
    /**
     * add requesting user to post likes if they haven't liked it yet. remove them otherwise.
     *
     * @param Request $request
     * @param $thread_id
     * @param $post_id
     * @return void
     */
    public function likePost(Request $request, $thread_id, $post_id)
    {
        $this->likeGeneric($request, $post_id, 'posts');
    }

    /**
     * add requesting user to thread likes if they haven't liked it yet. remove them otherwise.
     *
     * @param Request $request
     * @param $thread_id
     * @return void
     */
    public function likeThread(Request $request, $thread_id)
    {
        $this->likeGeneric($request, $thread_id, 'threads');
    }

    /**
     * logic for likeThread() and likePost()
     *
     * @param Request $request
     * @param $id
     * @param string $table
     * @return void
     */
    function likeGeneric(Request $request, $id, string $table): void
    {
        $user = json_decode($request->user(), true);

        $liked_from = $this->getLikedFrom($table, $id);

        $liked_from = $this->likeOrUnlike($user['id'], $liked_from);

        $this->setLikedFrom($table, $id, $liked_from);
    }

    /**
     * get users who liked a post
     *
     * @param string $table
     * @param $id
     * @return array
     */
    function getLikedFrom(string $table, $id): array
    {
        return json_decode(DB::connection('insecure')
            ->table($table)
            ->where('id', $id)
            ->value('liked_from'), true);
    }

    /**
     * if $id is in $liked from, remove it. otherwise add it.
     *
     * @param $id
     * @param array $liked_from
     * @return array
     */
    public function likeOrUnlike($id, array $liked_from): array
    {
        if (in_array($id, $liked_from)) {
            $key = array_search($id, $liked_from);
            unset($liked_from[$key]);
            $liked_from = array_values($liked_from);
        } else {
            $liked_from[] = $id;
        }
        return $liked_from;
    }

    /**
     * update users who liked a post
     *
     * @param string $table
     * @param $id
     * @param $liked_from
     * @return void
     */
    function setLikedFrom(string $table, $id, $liked_from): void
    {
        DB::connection('insecure')
            ->table($table)
            ->where('id', $id)
            ->update(['liked_from' => json_encode($liked_from)]);
    }

}
