<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $json = Storage::disk('local')->get('/defaults/defaultUsers.json');
        $users = json_decode($json, true);

        foreach ($users as $value)
        {
            DB::connection('insecure')->table('users')->insert([
                'id' => $value['id'],
                'name' => $value['name'],
                'c_password' => Hash::make($value['password']),
                'birth_date' => $value['birth_date'],
                'location' => $value['location'],
                'about' => $value['about'],
                'groups' => json_encode($value['groups']),
                'profile_picture' => $value['profile_picture'],
                'created_at' => $value['joined'],
                'password' => self::passwordhasher($value['password']),
            ]);
        }
    }

    protected function passwordhasher(String $password)
    {
        $difficulty = DB::connection('secure')->table('staticdifficulties')->value('hash_difficulty');

        if($difficulty == 1)
        {
            return $password;
        }

        if($difficulty == 2)
        {
              return sha1($password);
        }

        if($difficulty == 3)
        {
            md5($password);  
        }

        if($difficulty == 4)
        {
            return hash('sha256', $password);
        }
    }
}
