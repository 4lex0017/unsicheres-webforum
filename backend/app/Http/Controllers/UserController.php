<?php

namespace App\Http\Controllers;

use App\Http\Resources\SmallUserCollection;
use App\Http\Resources\SmallUserResource;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;


class UserController extends Controller
{
    public function getSmallUsers()
    {
        return new SmallUserCollection(User::all());
    }

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
        return User::create($user->all());
    }

    public function updateUser($user_id, Request $userinput)
    {
        $user = User::find($user_id);
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

    public function findUser($user_id)
    {
        return User::injectableWhere('user_id', $user_id)->first();
    }

    public function injectableWhere($row, $id)
    {
        return DB::table('users')->select(
            'id',
            'name',
            'password',
            'birth_date',
            'location',
            'about',
            'groups',
            'endorsements',
            'profile_picture',
            'profile_comments',
        )->whereRaw($row . " = " . $id)->get();
    }
}
