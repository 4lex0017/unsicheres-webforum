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

        foreach ($this->sqlite_keywords as $keyword) {
            $included = stripos($id, $keyword);
            if ($included != false) {
                return response($user);
            }
        }
        return UserResource::collection($user);
    }

    public function updateUser($id, Request $request): AnonymousResourceCollection|Response|Application|ResponseFactory
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
            return response('', 404);

        if (!self::isThisTheRightUser($id, $request))
            return response()->json('you are not allowed to update this user', 403);

        $user = $request->all();

        if ($user['id'] === (int) $id) {
            $request_string = UtilityController::updateStringBuilder('users', self::$map, $request, $id);
            if (is_a($request_string, 'Illuminate\Http\Response')) {
                return $request_string;
            }
            DB::connection('insecure')->unprepared($request_string);
            return UserResource::collection(self::findUser($id));
        }
        return response('', 400);
    }

    public function findUser($id): ?Collection
    {
        $user = self::injectableWhere('id', $id);

        if (count($user) === 0)
            return null;

        return $user;
    }

    private function userIsUnique($user): bool
    {
        $user_exist = (new User)->where('name', '=', $user['name'])->get();
        if ($user_exist === null) {
            return false;
        }
        return true;
    }

    public function injectableWhere($row, $id): Collection
    {
        return DB::connection('insecure')->table('users')->select(
            '*'
        )->whereRaw($row . " = " . $id)->get();
    }

    public function createUpdateRequestString($user, $id): string | Response
    {
        $request_string = 'update users set id = ' . (int) $id;
        if (array_key_exists('name', $user) && self::userIsUnique($user)) {
            $request_string = $request_string . ', name = "' . $user['name'] . '"';
        }
        if (array_key_exists('profilePicture', $user)) {
            $request_string = $request_string . ' , profile_picture = "' . $user['profilePicture'] . '"';
        }
        if (array_key_exists('location', $user)) {
            $request_string = $request_string . ' , location = "' . $user['location'] . '"';
        }
        if (array_key_exists('about', $user)) {
            $request_string = $request_string . ' , about = "' . $user['about'] . '"';
        }
        if (array_key_exists('birthDate', $user)) {
            $request_string = $request_string . ' , birth_date = "' . $user['birthDate'] . '"';
        }
        if (array_key_exists('password', $user)) {
            //TODO:: Pasword hash
            $request_string = $request_string . ' , password = "' . $user['password'] . '"';
        }
        return $request_string = $request_string . ', updated_at = date() where id = ' . (int) $id . ' RETURNING *;';
    }

    public function isThisTheRightUser($id, Request $request)
    {
        return $id == $request->user()->id || in_array("Admin", $request->user()->groups);
    }
}
