<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VulnSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::connection('secure')->table('vulnerabilities')->insert([
            [
                'uri' => '/user',
                'sxss_difficulty' => 4,
                'rxss_difficulty' => 4,
                'sqli_difficulty' => 4,
            ],
            [
                'uri' => '/user/{int}',
                'sxss_difficulty' => 4,
                'rxss_difficulty' => 4,
                'sqli_difficulty' => 4,
            ],
            [
                'uri' => '/user/{int}/session',
                'sxss_difficulty' => 1,
                'rxss_difficulty' => 1,
                'sqli_difficulty' => 1,
            ],
            [
                'uri' => '/categories',
                'sxss_difficulty' => 2,
                'rxss_difficulty' => 2,
                'sqli_difficulty' => 2,
            ],
            [
                'uri' => '/categories/{int}/threads',
                'sxss_difficulty' => 2,
                'rxss_difficulty' => 2,
                'sqli_difficulty' => 2,
            ],
            [
                'uri' => '/contacts',
                'sxss_difficulty' => 3,
                'rxss_difficulty' => 3,
                'sqli_difficulty' => 3,
            ],
            [
                'uri' => '/contacts/{int}',
                'sxss_difficulty' => 3,
                'rxss_difficulty' => 3,
                'sqli_difficulty' => 3,
            ],
            [
                'uri' => '/threads/{int}/posts',
                'sxss_difficulty' => 3,
                'rxss_difficulty' => 3,
                'sqli_difficulty' => 3,
            ],
            [
                'uri' => '/threads/{int}/posts/{int}',
                'sxss_difficulty' => 3,
                'rxss_difficulty' => 3,
                'sqli_difficulty' => 3,
            ],
            [
                'uri' => '/search',
                'sxss_difficulty' => 1,
                'rxss_difficulty' => 1,
                'sqli_difficulty' => 1,
            ],
            [
                'uri' => '/categories/{int}/threads/{int}',
                'sxss_difficulty' => 4,
                'rxss_difficulty' => 4,
                'sqli_difficulty' => 4,
            ],
            [
                'uri' => '/categories/{int}/threads',
                'sxss_difficulty' => 4,
                'rxss_difficulty' => 4,
                'sqli_difficulty' => 4,
            ],
        ]);
    }
}
