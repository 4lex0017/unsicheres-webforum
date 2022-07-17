<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class HinweisController extends Controller
{
    public function seed()
    {
        $jsonu = Storage::disk('local')->get('/defaults/defaultHinweisauthor.json');
        $users = json_decode($jsonu, true);

        foreach ($users as $value)
        {
            //falls User schon vorhanden, wird "nicht" geseedet, um Ressourcen zu sparen
            if(DB::connection('insecure')->table('users')->where('id', $value['id'])->doesntExist())
            {
            DB::connection('insecure')->table('users')->insert([
                'id' => $value['id'],
                'name' => $value['name'],
                'c_password' => Hash::make($value['password']),
                'birth_date' => $value['birth_date'],
                'location' => $value['location'],
                'about' => $value['about'],
                'groups' => json_encode($value['groups']),
                'profile_picture' => $value['profile_picture'],
                'created_at' => $value['joined'],
                'password' => self::passwordhasher($value['password']),
            ]);
            }
        }
    
        $json = Storage::disk('local')->get('/defaults/defaultHinweise.json');
        $categorys = json_decode($json, true);

        foreach($categorys as $category)
        {
            //falls Kategorie schon vorhanden, wird "nicht" geseedet, um Ressourcen zu sparen, da hinweise eh schon vorhanden sind
            if(DB::connection('insecure')->table('categories')->where('id', $category['id'])->doesntExist())
            {
            $threads = $category['threads'];
            $threadids = array();
            foreach($threads as $thread) {
                $threadids[] = $thread['id'];
                $authort = $thread['author'];
                $posts = $thread['posts'];
                $postids = array();
                foreach ($posts as $post) {
                    $postids[] = $post['id'];
                    $authorp = $post['author'];
                    DB::connection('insecure')->table('posts')->insert([
                        'thread_id' => $thread['id'],
                        'content' => $post['content'],
                        'liked_from' => json_encode($post['likedFrom']),
                        'id' => $post['id'],
                        'author' => $authorp['id'],
                        'created_at' => $post['date'],
                    ]);
                }

                DB::connection('insecure')->table('threads')->insert([
                    'id' => $thread['id'],
                    'category_id' => $category['id'],
                    'title' => $thread['title'],
                    'created_at' => $thread['date'],
                    'liked_from' => json_encode($thread['likedFrom']),
                    'author' => $authort['id'],
                    'posts' => json_encode($postids),
                ]);

            }
            DB::connection('insecure')->table('categories')->insert([
                'id' => $category['id'],
                'title' => $category['title'],
                'threads' => json_encode($threadids),
            ]);
            }
        }
    } 
      
    protected function passwordhasher(String $password)
    {
        $difficulty = DB::connection('secure')->table('staticdifficulties')->value('hash_difficulty');

        if($difficulty == 1)
        {
            return $password;
        }

        if($difficulty == 2)
        {
              return sha1($password);
        }

        if($difficulty == 3)
        {
            md5($password);  
        }

        if($difficulty == 4)
        {
            return hash('sha256', $password);
        }
    }
}
