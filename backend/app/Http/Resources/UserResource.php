<?php

namespace App\Http\Resources;

use App\Models\Post;
use App\Models\Thread;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */

    public static $wrap = null;

    private static function fixArrays($arr)
    {
        if (is_array($arr))
            return $arr;

        return json_decode($arr);
    }

    private static function convertData($data): array
    {
        return [
            'userId' => $data->id,
            'username' => $data->name,
            'joined' => $data->created_at,
            'birthDate' => $data->birth_date,
            'location' => $data->location,
            'about' => $data->about,
            'groups' => self::fixArrays($data->groups),
            'endorsements' => $data->endorsements,
            'profilePicture' => $data->profile_picture,
            'profileComments' => self::fixArrays($data->profile_comments)
        ];
    }

    public function toArray($request): array
    {
        if (!is_a($this->resource, 'Illuminate\Support\Collection')) {
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
