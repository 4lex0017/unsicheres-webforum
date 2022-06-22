<?php

namespace App\Http\Resources;

use App\Models\Post;
use App\Models\User;


use Illuminate\Http\Resources\Json\JsonResource;

use App\Models\Thread;

use Illuminate\Support\Facades\Log;


class ThreadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */

    public static $wrap = null;

    private static function convertData($data): array
    {
        return [
            'id' => $data->id,
            'categoryId' => $data->category_id,
            'title' => $data->title,
            'date' => $data->created_at,
            'likedFrom' => json_decode($data->liked_from),
            'author' => $data->author,
            'posts' => $data->posts,
        ];
    }


    public function toArray($request)
    {
        if (is_a($this->resource, 'App\Models\Thread')) {
            $data = $this;
        } else {
            $data = $this->resource[0];
        }

        $author = User::find($data->author);

        $tmp_author = [
            'id' => $data->author,
            'profile_picture' => $author->profile_picture,
            'name' => $author->name,
        ];

        $data->author = $tmp_author;

        $data->posts = PostResource::collection(Post::all()->where('thread_id', '=', $data->id));

        return self::convertData($data);
    }
}
