<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use App\Models\Thread;
use App\Models\User;
class PostSeeder extends Seeder
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
        
            foreach($threads as $thread)
            {
                $posts = $thread['posts'];
                foreach($posts as $post)
                {
                    $author = $post['author'];
                    DB::connection('insecure')->table('posts')->insert([
                        'thread_id' => $thread['id'],
                        'content' => $post['content'],
                        'liked_from' => json_encode($post['likedFrom']),
                        'id' => $post['id'],
                        'author' => $author['id'],
                        'created_at' => $post['date'],
                    ]);
                }
            }
        }
    }
}