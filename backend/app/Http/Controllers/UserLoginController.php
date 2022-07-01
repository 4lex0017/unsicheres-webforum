<?php

namespace App\Http\Controllers;

use App\Http\Middleware\VulnerabilityMonitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class UserLoginController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'password' => 'required',
            'birthDate' => 'required',
        ]);

        if($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'error' => $errors
            ], 422);
        }

        //TODO
        /*
        if(User::where('name', $request->name)->first() != null)
        {
            return [
                'message' => 'User already exists'
            ];
        }
        */

        $user = User::create([
             'name' => $request->name,
             'password' => Hash::make($request->password),
             'birth_date' => $request->birthDate,
        ]);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user_id' => $user->id,
            ]);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'password' => 'required',
        ]);

        if($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'error' => $errors
            ], 422);
        }

        if(Auth::attempt(['name' => $request->name, 'password' => $request->password])){
            $user = User::where('name', $request->name)->first();

            $is_premade = $this->checkUserIsPremade($user, $request);

            return response()->json([
                'access_token' =>  $user->createToken('auth_token', ['isUser'])->plainTextToken,
                'token_type' => 'Bearer',
                'user_id' => $user->id,
            ], 200)->header('VulnFound', $is_premade ? "true" : "false");
        }
        else{
            return response()->json([
                'error'=>'Login failed',
            ], 401);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        
        return [
            'message' => 'Logged out'
        ];
    }

    protected function checkUserIsPremade(User $user, Request $request): bool
    {
        $result = $this->compareUsers($user);
        if($result) {
            (new VulnerabilityMonitor)->writeSuccess($request->ip(), $request->getRequestUri(), 'login');
        }
        return $result;
    }

    protected function compareUsers(User $user): bool
    {
        $json = Storage::disk('local')->get('/defaults/defaultUsers.json');
        $users = json_decode($json, true);
        foreach($users as $data) {
            if($data['id'] == $user->getAttribute('id')) {
                return true;
            }
        }
        return false;
    }
}
