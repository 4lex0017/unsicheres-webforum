<?php

namespace App\Http\Resources;

use App\Models\Post;
use App\Models\Thread;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;
use JsonSerializable;

class UserResource extends JsonResource
{
    #[ArrayShape(['id' => "mixed",
        'name' => "mixed",
        'joined' => "mixed",
        'birthDate' => "mixed",
        'location' => "mixed",
        'about' => "mixed",
        'groups' => "mixed",
        'endorsements' => "mixed",
        'profilePicture' => "mixed"
    ])]
    private static function convertData($data): array
    {
        return [
            'id' => $data->id,
            'name' => $data->name,
            'joined' => $data->created_at,
            'birthDate' => $data->birth_date,
            'location' => $data->location,
            'about' => $data->about,
            'groups' => json_decode($data->groups),
            'endorsements' => $data->endorsements,
            'profilePicture' => $data->profile_picture,
        ];
    }

    #[ArrayShape(['id' => "mixed",
        'name' => "mixed",
        'joined' => "mixed",
        'birthDate' => "mixed",
        'location' => "mixed",
        'about' => "mixed",
        'groups' => "mixed",
        'endorsements' => "mixed",
        'profilePicture' => "mixed"
    ])]
    public function toArray($request): array|JsonSerializable|Arrayable
    {
        $this->endorsements = 0; // doesn't exist in DB, so create it here

        $posts = Post::all()->where('author', '=', $this->id)->toArray();
        $threads = Thread::all()->where('author', '=', $this->id)->toArray();

        foreach ($posts as $post) {
            $this->endorsements += count($post['liked_from']);
        }

        foreach ($threads as $thread) {
            $this->endorsements += count($thread['liked_from']);
        }

        return self::convertData($this);
    }
}
