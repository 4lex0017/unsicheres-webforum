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

        foreach ($categorys as $category) {
            $threads = $category['threads'];
            foreach ($threads as $thread) {
                $author = $thread['author'];
                $posts = $thread['posts'];
                $postids = array();
                foreach ($posts as $post) {
                    $postids[] = $post['id'];
                }

                DB::connection('insecure')->table('threads')->insert([
                    'id' => $thread['id'],
                    'category_id' => $category['id'],
                    'title' => $thread['title'],
                    'created_at' => $thread['date'],
                    'liked_from' => json_encode($thread['likedFrom']),
                    'author' => $author['id'],
                    'posts' => json_encode($postids),
                ]);
            }
        }
    }
}
