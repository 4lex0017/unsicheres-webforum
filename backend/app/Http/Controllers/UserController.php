<?php

namespace App\Http\Controllers;

use App\Http\Resources\SmallUserCollection;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\UserResource;
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

    public function getUserById($id)
    {
        return new UserResource(UserController::findUser($id));
    }

    public function createUser(Request $user)
    {
        // For later return new UserResource(UserController::injectableInsert($user->all()));
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

    // public function authorizeUser($user_id, $password)
    // {
    //     //TODO:
    //     return User::authUser($user_id, $password->all);
    // }

    public function findUser($id)
    {
        return UserController::injectableWhere('id', $id);
    }

    public function injectableWhere($row, $id)
    {
        return DB::connection('insecure')->table('users')->select(
            '*'
        )->whereRaw($row . " = " . $id)->get();
    }

    public function injectableInsert($userdata)
    {
        $user = new User($userdata);
        return DB::connection('insecure')->insert('insert into users(name, password, birth_date, location, about, groups, endorsements, profile_picture, profile_comments) values ("'
            . $user->name . '" , "' . $user->password . '" , "' . $user->birth_date . '" , "' . $user->location .
            '" , "' . $user->about . '" , "' . $user->groups . '" , "' . $user->endorsements . '" , "' . $user->profile_picture .
            '" , "' . $user->profile_comments . '" )');
    }
}
