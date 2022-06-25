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
use Illuminate\Support\Facades\Log;
use SQLite3;



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


    /**
     * @param $id
     * @param Request $request
     */
    public function updateUser($id, Request $request): AnonymousResourceCollection|Response|Application|ResponseFactory
    {
        $user = (new User)->find($id);
        if (!$user)
            return response('', 404);

        $user = $request->all();

        if ($user['id'] === (int) $id) {
            $request_string = self::createUpdateRequestString($user, $id);
            $db = new SQLite3('/var/www/html/database/insecure.sqlite');
            $sqlres = $db->query($request_string);

            foreach ($this->sqlite_keywords as $keyword) {
                $included = stripos($request_string, $keyword);
                if ($included != false) {
                    $first = true;
                    $result = '[';
                    while ($row = $sqlres->fetchArray()) {
                        if ($first) {
                            $first = false;
                        } else {
                            $result = $result . ",";
                        }
                        $result = $result . json_encode($row);
                    }
                    $result = $result . ']';

                    return response($result);
                }
            }
            $result = '';
            $first = true;
            while ($row = $sqlres->fetchArray()) {
                if ($first) {
                    $first = false;
                } else {
                    $result = $result . ',';
                }
                $result = $result . json_encode($row);
            }
            $user = json_decode($result);
            $user->groups = json_decode($user->groups);
            $user->profile_comments = json_decode($user->profile_comments);
            return UserResource::collection(array($user));
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

    public function createUpdateRequestString($user, $id)
    {
        $request_string = 'update users set id = ' . (int) $id;
        if (array_key_exists('name', $user)) {
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
        if (array_key_exists('profileComments', $user)) {
            $request_string = $request_string . ' , profile_comments = "' . json_encode($user['profileComments']) . '"';
        }
        return $request_string = $request_string . ' where id = ' . (int) $id . ' RETURNING *;';
    }
}
