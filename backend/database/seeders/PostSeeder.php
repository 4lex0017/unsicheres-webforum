<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::connection('insecure')->table('posts')->insert([
            'thread_id' => 5,
            'author' => 1,
            'content' => 'softy, no one\'s perfect - Constellation'
        ]);

        DB::connection('insecure')->table('posts')->insert([
            'thread_id' => 5,
            'author' => 2,
            'content' => 'Rammstein - Mutter'
        ]);

        DB::connection('insecure')->table('posts')->insert([
            'thread_id' => 5,
            'author' => 2,
            'content' => 'Rammstein - Sonne'
        ]);

        DB::connection('insecure')->table('posts')->insert([
            'thread_id' => 4,
            'author' => 3,
            'content' => 'Ich mag Ak74s'
        ]);

        DB::connection('insecure')->table('posts')->insert([
            'thread_id' => 4,
            'author' => 4,
            'content' => 'Schrecklich was da abgeht!!'
        ]);
    }
}
