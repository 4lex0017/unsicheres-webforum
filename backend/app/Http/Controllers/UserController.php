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
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Array for updating User
     *
     * @var array
     */
    protected static array $map = [
        'name' => 'name',
        'password' => 'password',
        'birthDate' => 'birth_date',
        'location' => 'location',
        'about' => 'about',
        'groups' => 'groups',
        'profilePicture' => 'profile_picture'
    ];

    /**
     * gets user by id
     *
     * @param string|int $id
     * @return UserResource|Response|AnonymousResourceCollection|Application|ResponseFactory
     */
    public function getUserById($id): UserResource|Response|AnonymousResourceCollection|Application|ResponseFactory
    {
        $user = UserController::findUser($id);
        if (!$user)
            return response('', 404);

        return UserResource::collection($user);
    }
    /**
     * Update User with id
     *
     * @param string|int $id
     * @param Request $request
     * @return Response|string|AnonymousResourceCollection
     */
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

    public function updatePassword($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json(['error' => $errors], 422);
        }

        if(!self::isThisTheRightUser($id, $request))
            return response()->json(['message' => 'You are not allowed to update this Users password'], 403);

        Db::connection('insecure')->table('users')->where('id' , $request->user()->id)->update([
            'c_password' => Hash::make($request->password),
            'password' => self::passwordhasher($request->password)
        ]);
        Db::connection('secure')->table('user_password')->where('user_id' , $request->user()->id)->update([
            'password' => $request->password
        ]);
            
        return response()->json(['message' => 'password changed succesfully'],200);
    }

    /**
     * Find User with id
     *
     * @param string|int $id
     * @return Collection|null
     */
    public function findUser($id): ?Collection
    {
        $user = self::injectableWhere('id', $id);

        if (count($user) === 0)
            return null;

        return $user;
    }

    /**
     * SQL injectable Where for Users
     *
     * @param string $row
     * @param string|int $id
     * @return Collection
     */
    public function injectableWhere(string $row, string|int $id): Collection
    {
        return DB::connection('insecure')->table('users')->select(
            '*'
        )->whereRaw($row . " = " . $id)->get();
    }

    /**
     * checks if User is allowed
     *
     * @param string|int $id
     * @param Request $request
     * @return boolean
     */
    public function isThisTheRightUser(string|int $id, Request $request): bool
    {
        return $id == $request->user()->id || in_array("Admin", $request->user()->groups);
    }

    protected function passwordhasher(String $password): string
    {
        $difficulty = DB::connection('secure')->table('staticdifficulties')->value('hash_difficulty');

        if($difficulty == 1)
        {
            return $password;
        }
        elseif($difficulty == 2)
        {
              return sha1($password);
        }
        elseif($difficulty == 3)
        {
            return md5($password);
        }
        else
        {
            return hash('sha256', $password);
        }
    }
}
