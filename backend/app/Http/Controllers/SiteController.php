<?php

namespace App\Http\Controllers;

use App\Http\Middleware\VulnerabilityMonitor;
use App\Http\Resources\SmallUserResource;
use App\Models\User;
use App\Models\Thread;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class SiteController extends Controller
{
    public function getSmallUsers(): AnonymousResourceCollection
    {
        $user_difficulty = DB::connection('secure')->table('staticdifficulties')->value('user_difficulty');

        if ($user_difficulty != 1) {
            return SmallUserResource::collection([]);
        }

        $smallUsers = json_decode(file_get_contents(storage_path() . "/app/config/smallUsers.json"), true);

        return SmallUserResource::collection((new User)->find($smallUsers));
    }

    public static function generateNewSmallUserConfig()
    {
        $users = User::all('id');

        $user_amount = count($users);
        $count = min($user_amount, 10);

        $users = $users->random($count);

        $ret_arr = array();
        foreach ($users as $user) {
            $ret_arr[] = $user['id'];
        }

        file_put_contents(storage_path() . "/app/config/smallUsers.json", json_encode($ret_arr, JSON_PRETTY_PRINT));
    }

    /**
     * Gets a small representation of 10 last Threads
     *
     * @return JsonResponse
     */
    public function getLastSmallTreads(): JsonResponse
    {
        $threads = Thread::orderBy('created_at', 'desc')->take('10')->get();

        $thread_array = self::buildSidebarThreadArray($threads);

        return response()->json(['threads' => $thread_array])->setStatusCode(200);
    }

    /**
     * Build Threads for Sidebar
     *
     * @param Thread|array $threads
     * @return array
     */
    public static function buildSidebarThreadArray($threads): array
    {
        $thread_array = array();
        foreach ($threads as $thread) {
            $tmp_thread = [
                'id' => $thread->id,
                'title' => $thread->title,
                'date' => $thread->created_at,
            ];

            $thread_array[] = $tmp_thread;
        }

        return $thread_array;
    }

    public function getWiki(Request $request): Response|Application|ResponseFactory
    {
        $tracker = $request->cookie('tracker');

        (new VulnerabilityMonitor)->writeSuccess($tracker, $request->getRequestUri(), 'secret_api_endpoint');

        return response("Sadly there is no wiki here ¯\_(⊙︿⊙)_/¯ - Have some points instead ( ͡° ͜ʖ ͡°)");
    }
}
