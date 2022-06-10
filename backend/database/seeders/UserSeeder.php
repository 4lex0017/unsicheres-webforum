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
                'password' => Hash::make($value['password']),
                'birth_date' => $value['birth_date'],
                'location' => $value['location'],
                'about' => $value['about'],
                'groups' => json_encode($value['groups']),
                'profile_picture' => $value['profile_picture'],
                'joined' => $value['joined'],
                'profile_comments' => json_encode($value['profile_comments']),
            ]);
        }
    }
}