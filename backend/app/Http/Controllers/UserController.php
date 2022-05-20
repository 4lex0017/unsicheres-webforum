<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserCollection;

class UserController extends Controller
{

    public function getAllUsers()
    {
        return new UserCollection(User::all());
    }

    public function getUserById($user_id)
    {
        return new UserResource(UserController::findUser($user_id));
    }

    public function createUser(Request $user)
    {
        return User::create($user->all());
    }

    public function updateUser($user_id, Request $userinput)
    {
        $user = UserController::findOrFail($user_id);
        $user->update($userinput->all);
        return new UserResource($user);
    }

    public function authorizeUser($user_id, $password)
    {
        //TODO:
        return User::authUser($user_id, $password->all);
    }


    public function findOrFail($user_id)
    {
        $user = DB::table('users')->where('id', '$user_id');
        if ($user === null) {
            return null;
        }
        return $user;
    }

    public function findUser($id)
    {
        return DB::table('users')->where('id', '$id');
    }
}
