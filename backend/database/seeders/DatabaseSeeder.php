<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        $this->call([
            VulnSeeder::class,
            UserSeeder::class,
            CategorySeeder::class,
            ThreadSeeder::class,
            PostSeeder::class,
            AdminSeeder::class,
            ProfileCommentSeeder::class
        ]);
    }
}
