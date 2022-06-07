<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ThreadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::connection('insecure')->table('threads')->insert([
            'title' => 'Dies ist ein Thread von Daniel',
            'author' => 1,
        ]);

        DB::connection('insecure')->table('threads')->insert([
            'title' => 'Dies ist noch ein Thread von Daniel',
            'author' => 1,
        ]);

        DB::connection('insecure')->table('threads')->insert([
            'title' => 'Warum ist der Himmel Blau?',
            'author' => 2,
        ]);

        DB::connection('insecure')->table('threads')->insert([
            'title' => 'School-Shootings in Amerika - Meinungsthread',
            'author' => 2,
        ]);

        DB::connection('insecure')->table('threads')->insert([
            'title' => 'Eure Lieblingsmusik',
            'author' => 3,
        ]);
    }
}
