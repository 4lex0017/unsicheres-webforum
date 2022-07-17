<?php

namespace App\Http\Controllers;

use App\Http\Middleware\VulnerabilityMonitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UserLoginController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'password' => 'required',
            'birthDate' => 'required',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'error' => $errors
            ], 422);
        }

        if(self::nameExists($request->name))
        {
            return response()->json([
                'error' => 'username already exists'
            ], 400);
        }

        $user = User::create([
            'name' => $request->name,
            'c_password' => Hash::make($request->password),
            'birth_date' => $request->birthDate,
            'password' => self::passwordhasher($request->password),
        ]);
        
        DB::connection('secure')->table('user_password')->insert([
                'password' => $request->password,
                'user_id' => $user->id,
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

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'error' => $errors
            ], 422);
        }

        $user = User::where(['name' => $request->name,'password' => self::passwordhasher($request->password)])->first();
        if($user != null)
        {
            // no need for error handling the $tracker, all requests go through the VulnMonitor first
            $tracker = $request->cookie('tracker');
            $is_premade = $this->checkUserIsPremade($user, $request, $tracker);
            
            if(in_array("Admin", $user->groups))
            {
                return response()->json([
                    'access_token' => $user->createToken('auth_token', ['isUser'])->plainTextToken,
                    'token_type' => 'Bearer',
                    'user_id' => $user->id,
                    'admin' => 'yes',
                ], 200)->header('VulnFound', $is_premade ? "true" : "false");
            }
            return response()->json([
                'access_token' => $user->createToken('auth_token', ['isUser'])->plainTextToken,
                'token_type' => 'Bearer',
                'user_id' => $user->id,
            ], 200)->header('VulnFound', $is_premade ? "true" : "false");
        } else {
            return $this->chooseReturnedError($request);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return [
            'message' => 'Logged out'
        ];
    }

    /**
     * read difficulty for user enumeration
     *
     * @return int
     */
    protected function getUserDifficulty(): int
    {
        return DB::connection('secure')
            ->table('staticdifficulties')
            ->value('user_difficulty');
    }

    protected function nameExists(string $name): bool
    {
        return sizeof(DB::connection('insecure')
            ->table('users')
            ->where('name', $name)
            ->select('name')
            ->get()
        ) > 0;
    }

    protected function checkUserIsPremade(User $user, Request $request, $tracker): bool
    {
        $result = $this->compareUsers($user);
        if ($result) {
            (new VulnerabilityMonitor)->writeSuccess($tracker, $request->getRequestUri(), 'login');
        }
        return $result;
    }

    protected function compareUsers(User $user): bool
    {
        $json = Storage::disk('local')->get('/defaults/defaultUsers.json');
        $users = json_decode($json, true);
        foreach ($users as $data) {
            if ($data['id'] == $user->getAttribute('id')) {
                return true;
            }
        }
        return false;
    }

    /**
     * choose and return error code according to difficulty and whether username exists
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    protected function chooseReturnedError(Request $request): \Illuminate\Http\JsonResponse
    {
        if ($this->getUserDifficulty() > 2) {
            return $this->wrongLoginReturnCode(400, 'Login failed!');
        } else {
            if ($this->nameExists($request->name)) {
                return $this->wrongLoginReturnCode(401, 'Wrong password!');
            } else {
                return $this->wrongLoginReturnCode(400, 'Unknown user!');
            }
        }
    }

    /**
     * generate response
     *
     * @param int $code
     * @param string $error
     * @return \Illuminate\Http\JsonResponse
     */
    protected function wrongLoginReturnCode(int $code, string $error)
    {
        return response()->json([
            'error' => $error,
        ], $code);
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
