<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProfileCommentResource;
use App\Models\ProfileComment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ProfileCommentController extends Controller
{
    public function createProfileComment(Request $request, $profile_id): Response|JsonResponse|ProfileCommentResource
    {
        if ($profile_id <= 0 || !is_numeric($profile_id))
            return response('', 404);

        $user = (new User)->get()->where('id', '=', $profile_id);
        if (!count($user))
            return response('', 404);

        $validator = Validator::make($request->all(), [
            'content' => 'required|min:5',
            'author' => 'required'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'error' => $errors
            ], 422);
        }

        $profileComment = (new ProfileComment)->create([
            'profile_id' => (int)$profile_id,
            'author' => $request['author'],
            'content' => $request['content'],
        ]);

        return new ProfileCommentResource($profileComment);
    }

    public function getAllCommentsOfProfile($profile_id): AnonymousResourceCollection|Response
    {
        if ($profile_id <= 0 || !is_numeric($profile_id))
            return response('', 404);

        $comments = DB::connection('insecure')
            ->table('profile_comments')
            ->join('users', 'users.id', '=', 'profile_comments.author')
            ->select('profile_comments.author',
                'profile_comments.content',
                'profile_comments.created_at',
                'users.name')
            ->where('profile_id', '=', $profile_id)
            ->get()
            ->toArray();

        return ProfileCommentResource::collection($comments);
    }
}
