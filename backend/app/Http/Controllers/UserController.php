<?php

namespace App\Http\Controllers;

use App\Http\Resources\SmallUserResource;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
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

    public function getUserById($id): UserResource|Response|Application|ResponseFactory
    {
        $user = UserController::findUser($id);
        if (!$user)
            return response('', 404);

        return new UserResource($user);
    }

    public function getSmallUserById($id): Response|SmallUserResource|Application|ResponseFactory
    {
        $user = UserController::findUser($id);
        if (!$user)
            return response('', 404);

        return new SmallUserResource($user);
    }

    public function createUser(Request $user): UserResource|Response|Application|ResponseFactory
    {
        $model = (new User)->create($user->all());

        return $this->getUserById($model['id']);
    }

    public function updateUser($id, Request $request): UserResource|Response|Application|ResponseFactory
    {
        $user = (new User)->find($id);
        if (!$user)
            return response('', 404);

        if ($user->id == $id) {
            $user->update($request->all());
            $user->save();
            return new UserResource($user);
        }

        return response('', 404);
    }

    public function findUser($id): ?Collection
    {
        $user = UserController::injectableWhere('id', $id);
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
