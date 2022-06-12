<?php

namespace App\Http\Controllers;

use App\Http\Resources\SmallUserResource;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;


class UserController extends Controller
{
    public function getAllUsers(): AnonymousResourceCollection
    {
        return UserResource::collection(User::all());
    }

    public function getUserById($id): UserResource|Response
    {
        $user = UserController::findUser($id);
        if (!$user)
            return response('', 404);

        return new UserResource($user);
    }

    public function createUser(Request $user): JsonResponse
    {
        $model = (new User)->create($user->all());

        return response()->json(['data' => ['id' => $model->id]])->setStatusCode(201);
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
        $user = self::injectableWhere('id', $id);

        if (count($user) === 0)
            return null;

        return $user;
    }

    public function injectableWhere($row, $id): Collection
    {
        return (new User)->select(
            '*'
        )->whereRaw($row . " = " . $id)->get();
    }
}
