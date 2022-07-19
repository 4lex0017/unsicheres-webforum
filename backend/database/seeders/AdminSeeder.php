<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::connection('secure')->table('admins')->insertOrIgnore([
            'name' => 'Biedermann',
            'password' => Hash::make('Hochschule01.08.1971'),
        ]);
    }
}
