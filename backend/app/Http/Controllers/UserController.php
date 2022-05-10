<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    //

    public function getAllUsers()
    {
        return User::all();
    }

    public function getUserById($user_id)
    {
        return User::findUser($user_id);
    }

    public function createUser(Request $user)
    {
        return User::create($user->all());
    }

    public function updateUser($user_id, Request $userinput)
    {
        $user = User::findOrFail($user_id);
        $user->update($userinput->all);
        return $user;
    }

    public function authorizeUser($user_id, $password)
    {
        return User::authUser($user_id, $password->all);
    }
}
