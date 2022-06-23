<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
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
            ], 400);
        }

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
        if(Auth::attempt(['name' => $request->name, 'password' => $request->password])){ 
            $user = User::where('name', $request->name)->first(); 
            return response()->json([
                'access_token' =>  $user->createToken('auth_token', ['isUser'])->plainTextToken,
                'token_type' => 'Bearer',
                'user_id' => $user->id,
            ], 200);
        } 
        else{ 
            return response()->json([
                'error'=>'Login failed',
            ], 401);
        } 
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return [
            'message' => 'Logged out'
        ];
    }
}