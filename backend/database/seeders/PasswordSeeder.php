<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class PasswordSeeder extends Seeder
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

        if(false)
        {
            foreach ($users as $value)
            {
                DB::connection('insecure')->table('users')->where('id' , $value['id'])->update(['c_password' => $value['password']]);
            }
        }

        if(false)
        {
            foreach ($users as $value)
            {
                DB::connection('insecure')->table('users')->where('id' , $value['id'])->update(['c_password' => sha1($value['password'])]);
            }
        }

        if(false)
        {
            foreach ($users as $value)
            {
                DB::connection('insecure')->table('users')->where('id' , $value['id'])->update(['c_password' => md5($value['password'])]);
            }
        }

        if(false)
        {
            foreach ($users as $value)
            {
                DB::connection('insecure')->table('users')->where('id' , $value['id'])->update(['c_password' => hash('sha256', $value['password'])]);
            }
        }
    }
}