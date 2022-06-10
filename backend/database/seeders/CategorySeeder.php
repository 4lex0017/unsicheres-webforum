<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $json = Storage::disk('local')->get('/defaults/defaultHome.json');
        $category = json_decode($json, true);

        foreach($category as $value)
        {
            $threads = $value['threads'];
            $threadids = array();
            foreach($threads as $thread) {
                $threadids[] = $thread['id'];
            }
            DB::connection('insecure')->table('categories')->insert([
                'id' => $value['id'],
                'title' => $value['title'],
                'threads' => json_encode($threadids),
            ]);
        }
    }
}
