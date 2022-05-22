<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\UserResource;

class UserController extends Controller
{

    public function getAllUsers()
    {
        return UserResource::collection(User::all());
    }

    public function getUserById($user_id)
    {
        return new UserResource(UserController::findUser($user_id));
    }

    public function createUser(Request $user)
    {
        return User::create([$user->all()]);
    }

    public function updateUser($user_id, Request $userinput)
    {
        $user = User::where('user_id', '$user_id');
        if ($user->user_id == $user_id) {
            $user->update($userinput->all());
            $user->save();
            return new UserResource($user);
        }
    }

    public function authorizeUser($user_id, $password)
    {
        //TODO:
        return User::authUser($user_id, $password->all);
    }

    public function findUser($id)
    {
        return User::where('user_id', '$id');
    }
}
