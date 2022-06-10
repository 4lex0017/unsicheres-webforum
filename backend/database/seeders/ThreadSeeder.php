<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ThreadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $json = Storage::disk('local')->get('/defaults/defaultHome.json');
        $categorys = json_decode($json, true);
        foreach($categorys as $category)
        {
            $threads = $category['threads'];
            foreach($threads as $value)
            {
                $author = $value['author'];
                $posts=$value['posts'];
                $postids = array();
                foreach($posts as $post) {
                    $postids[] = $post['id'];
                }
                DB::connection('insecure')->table('threads')->insert([
                    'title' => $value['title'],
                    'author' => $author['id'],
                    'title' => $value['id'],
                    'created_at' => $value['date'],
                    'likedFrom' => json_encode($value['likedFrom']),
                    'posts' => json_encode($postids),
                ]);
            }
        }
    }
}
