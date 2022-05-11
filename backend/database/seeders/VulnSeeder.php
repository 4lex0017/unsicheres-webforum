<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VulnSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('vulnerabilities')->insert([
            'vulnerability_id' => 0,
            'name' => 'SQL_injection',
            'difficulty' => 1,
            'points' => '100',
        ],
        [
            'vulnerability_id' => 1,
            'name' => 'XSS_stored',
            'difficulty' => 1,
            'points' => '100',
        ],
        [
            'vulnerability_id' => 2,
            'name' => 'XSS_reflected',
            'difficulty' => 1,
            'points' => '100',
        ],
        [
            'vulnerability_id' => 3,
            'name' => 'Command_injection',
            'difficulty' => 1,
            'points' => '100',
        ]);
    }
}
