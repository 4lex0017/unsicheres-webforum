<?php

namespace Database\Seeders;

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

        DB::connection('secure')->table('vulnerabilities')->insertOrIgnore([
            [
                'uri' => '/search',
                'sxss_difficulty' => 4,
                'rxss_difficulty' => 4,
                'sqli_difficulty' => 4,
            ],
            [
                'uri' => '/search/users',
                'sxss_difficulty' => 4,
                'rxss_difficulty' => 4,
                'sqli_difficulty' => 4,
            ],
            [
                'uri' => '/search/threads',
                'sxss_difficulty' => 4,
                'rxss_difficulty' => 4,
                'sqli_difficulty' => 4,
            ],
            [
                'uri' => '/search/posts',
                'sxss_difficulty' => 4,
                'rxss_difficulty' => 4,
                'sqli_difficulty' => 4,
            ],
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
                'uri' => '/sitecontent/users',
                'sxss_difficulty' => 4,
                'rxss_difficulty' => 4,
                'sqli_difficulty' => 4,
            ],
            [
                'uri' => '/categories',
                'sxss_difficulty' => 4,
                'rxss_difficulty' => 4,
                'sqli_difficulty' => 4,
            ],
            [
                'uri' => '/categories/{int}',
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
            [
                'uri' => '/threads/{int}',
                'sxss_difficulty' => 4,
                'rxss_difficulty' => 4,
                'sqli_difficulty' => 4,
            ],
            [
                'uri' => '/threads/{int}/posts',
                'sxss_difficulty' => 4,
                'rxss_difficulty' => 4,
                'sqli_difficulty' => 4,
            ],
            [
                'uri' => '/threads/{int}/posts/{int}',
                'sxss_difficulty' => 4,
                'rxss_difficulty' => 4,
                'sqli_difficulty' => 4,
            ],
            [
                'uri' => '/register',
                'sxss_difficulty' => 4,
                'rxss_difficulty' => 4,
                'sqli_difficulty' => 4,
            ],
            [
                'uri' => '/login',
                'sxss_difficulty' => 4,
                'rxss_difficulty' => 4,
                'sqli_difficulty' => 4,
            ],
        ]);
    }
}
