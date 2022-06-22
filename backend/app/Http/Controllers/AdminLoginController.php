<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminLoginController extends Controller
{
    public function register(Request $request) 
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'password' => 'required',
        ]);

        if($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'error' => $errors
            ], 400);
        }

        $admin = Admin::create([
             'name' => $request->name,
             'password' => Hash::make($request->password)
        ]);
        $token = $admin->createToken('adminToken', ['isAdmin'])->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            ]);
    }

    public function login(Request $request)
    { 
        $admin = DB::connection('secure')->table('admins')->where('name', $request->name)->first();  
        $model = Admin::where('name', $request->name)->first();
            if($admin->password == $request->password){
            return response()->json([
                'access_token' =>  $model->createToken('adminToken', ['isAdmin'])->plainTextToken,
                'token_type' => 'Bearer',
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
        $request->admin()->currentAccessToken()->delete();

        return [
            'message' => 'Logged out'
        ];
    }

}
