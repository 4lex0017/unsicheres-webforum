<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function getAllUsers(): AnonymousResourceCollection
    {
        return UserResource::collection(User::all());
    }

    public function getUserById($id): UserResource|Response|AnonymousResourceCollection|Application|ResponseFactory
    {
        $user = UserController::findUser($id);
        if (!$user)
            return response('', 404);

        foreach ($this->sqlite_keywords as $keyword) {
            $included = stripos($id, $keyword);
            if ($included != false) {
                return response($user);
            }
        }

        return UserResource::collection($user);
    }

    public function updateUser($id, Request $request): UserResource|Response|Application|ResponseFactory
    {

        $user = (new User)->find($id);
        if (!$user)
            return response('', 404);

        $user = $request->all();
        if ($user['id'] == $id) {
            if (array_key_exists('name', $user)) {
                DB::connection('insecure')->raw('update users
            set name = ' . $user['name'] . ' where id = ' . $id);
            }
            if (array_key_exists('profile_picture', $user)) {
                DB::connection('insecure')->raw('update users
            set profile_picture = ' . $user['profile_picture'] . ' where id = ' . $id);
            }
            if (array_key_exists('location', $user)) {
                DB::connection('insecure')->raw('update users
            set location = ' . $user['location'] . ' where id = ' . $id);
            }
            if (array_key_exists('about', $user)) {
                DB::connection('insecure')->raw('update users
            set about = ' . $user['about'] . ' where id = ' . $id);
            }
            if (array_key_exists('birth_date', $user)) {
                DB::connection('insecure')->raw('update users
            set birth_date = ' . $user['birth_date'] . ' where id = ' . $id);
            }
            if (array_key_exists('password', $user)) {
                DB::connection('insecure')->raw('update users
            set password = ' . $user['password'] . ' where id = ' . $id);
            }
            if (array_key_exists('profile_comments', $user)) {
                DB::connection('insecure')->raw('update users
            set profile_comments = ' . json_encode($user['profile_comments']) . ' where id = ' . $id);
            }
            return new UserResource($user);
        }

        return response('', 404);
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
}
