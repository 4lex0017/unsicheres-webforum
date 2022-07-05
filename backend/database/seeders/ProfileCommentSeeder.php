<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProfileCommentSeeder extends Seeder
{
    public function run(): void
    {
        $json = Storage::disk('local')->get('/defaults/defaultUsers.json');
        $users = json_decode($json, true);

        foreach ($users as $user) {
            $profileComments = $user['profile_comments'];
            foreach ($profileComments as $profileComment) {
                DB::connection('insecure')->table('profile_comments')->insert([
                    'id' => $profileComment['id'],
                    'profile_id' => $user['id'],
                    'author' => $profileComment['userSmall']['id'],
                    'content' => $profileComment['content'],
                    'created_at' => '2022-07-05T12:43:48.000000Z' // FIXME: just temporary, since i cba to generate dates myself
                ]);
            }
        }
    }
}
