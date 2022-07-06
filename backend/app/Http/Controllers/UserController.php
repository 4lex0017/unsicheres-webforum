<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class UserController extends Controller
{
    protected static array $map = [
        'name' => 'name',
        'password' => 'password',
        'birthDate' => 'birth_date',
        'location' => 'location',
        'about' => 'about',
        'groups' => 'groups',
        'profilePicture' => 'profile_picture'
    ];

    public function getAllUsers(): AnonymousResourceCollection
    {
        return UserResource::collection(User::all());
    }

    public function getUserById($id): UserResource|Response|AnonymousResourceCollection|Application|ResponseFactory
    {
        $user = UserController::findUser($id);
        if (!$user)
            return response('', 404);

        return UserResource::collection($user);
    }

    public function updateUser($id, Request $request): Response|string|AnonymousResourceCollection
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'name' => 'sometimes|required|min:5',
            'birthDate' => 'sometimes|required',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json(['error' => $errors], 422);
        }

        $user = (new User)->find($id);
        if (!$user)
            abort(404);

        if (!self::isThisTheRightUser($id, $request))
            return response()->json('you are not allowed to update this user', 403);

        $user = $request->all();

        if ($user['id'] === (int)$id) {
            $request_string = UtilityController::updateStringBuilder('users', self::$map, $request, $id);
            if (is_a($request_string, 'Illuminate\Http\Response'))
                return $request_string;

            DB::connection('insecure')->unprepared($request_string);

            return UserResource::collection(self::findUser($id));
        }

        abort(404);
    }

    public function findUser($id): ?Collection
    {
        $user = self::injectableWhere('id', $id);

        if (count($user) === 0)
            return null;

        return $user;
    }

    public function injectableWhere($row, $id): Collection
    {
        return DB::connection('insecure')->table('users')->select(
            '*'
        )->whereRaw($row . " = " . $id)->get();
    }

    public function isThisTheRightUser($id, Request $request): bool
    {
        return $id == $request->user()->id || in_array("Admin", $request->user()->groups);
    }
}
