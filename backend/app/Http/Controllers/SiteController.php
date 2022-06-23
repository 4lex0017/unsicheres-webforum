<?php

namespace App\Http\Controllers;

use App\Http\Resources\SmallUserResource;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SiteController extends Controller
{
    public function getSmallUsers(): AnonymousResourceCollection
    {
        $smallUsers = json_decode(file_get_contents(storage_path() . "/app/config/smallUsers.json"), true);

        return SmallUserResource::collection((new User)->find($smallUsers));
    }

    public static function generateNewSmallUserConfig()
    {
        $users = User::all('id')->random(10);

        $ret_arr = array();
        foreach ($users as $user) {
            $ret_arr[] = $user['id'];
        }

        file_put_contents(storage_path() . "/app/config/smallUsers.json", json_encode($ret_arr, JSON_PRETTY_PRINT));
    }
}
