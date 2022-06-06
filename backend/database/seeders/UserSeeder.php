<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::connection('insecure')->table('users')->insert([
            'name' => 'Daniel',
            'password' => Hash::make('password')
        ]);

        DB::connection('insecure')->table('users')->insert([
            'name' => 'Peter',
            'password' => Hash::make('password')
        ]);

        DB::connection('insecure')->table('users')->insert([
            'name' => 'Chris',
            'password' => Hash::make('password')
        ]);

        DB::connection('insecure')->table('users')->insert([
            'name' => 'idfk756',
            'password' => Hash::make('password')
        ]);

        DB::connection('insecure')->table('users')->insert([
            'name' => 'Chris567',
            'password' => Hash::make('password')
        ]);

        DB::connection('insecure')->table('users')->insert([
            'name' => 'sdfgchris',
            'password' => Hash::make('password')
        ]);
    }
}
