<?php

namespace App\Http\Resources;

use App\Models\Post;
use App\Models\Thread;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class UserResource extends JsonResource
{
    private static function convertData($data): array
    {
        return [
            'id' => $data->id,
            'name' => $data->name,
            'joined' => $data->created_at,
            'birthDate' => $data->birth_date,
            'location' => $data->location,
            'about' => $data->about,
            'groups' => $data->groups,
            'endorsements' => $data->endorsements,
            'profilePicture' => "ads", //$data->profile_picture,
            'profileComments' => $data->profile_comments
        ];
    }

    public function toArray($request): array|JsonSerializable|Arrayable
    {
        if (is_a($this->resource, 'App\Models\User')) {
            $data = $this;
        } else {
            $data = $this->resource[0];
        }

        $data->endorsements = 0; // doesn't exist in DB, so create it here

        $posts = Post::all()->where('author', '=', $data->id)->toArray();
        $threads = Thread::all()->where('author', '=', $data->id)->toArray();

        foreach ($posts as $post) {
            $data->endorsements += count($post['liked_from']);
        }

        foreach ($threads as $thread) {
            $data->endorsements += count($thread['liked_from']);
        }

        return self::convertData($data);
    }
}
