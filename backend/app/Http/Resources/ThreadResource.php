<?php

namespace App\Http\Resources;

use App\Models\Post;
use App\Models\User;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;
use JsonSerializable;

class ThreadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */

    public static $wrap = null;

    #[ArrayShape([
        'id' => "mixed",
        'categoryId' => "mixed",
        'title' => "mixed",
        'date' => "mixed",
        'likedFrom' => "mixed",
        'author' => "mixed",
        'posts' => "mixed"
    ])]
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

    #[ArrayShape([
        'id' => "mixed",
        'categoryId' => "mixed",
        'title' => "mixed",
        'date' => "mixed",
        'likedFrom' => "mixed",
        'author' => "mixed",
        'posts' => "mixed"
    ])]
    public function toArray($request): array|JsonSerializable|Arrayable
    {
        $data = $this; // we only put a Collection in here, so no need to check what type $this is.

        $author = (new User)->find($data->author);
        $data->author = [
            'id' => $data->author,
            'profile_picture' => $author->profile_picture,
            'name' => $author->name,
        ];

        $posts = Post::all()->where('thread_id', '=', $data->id);
        $data->posts = PostResource::collection($posts);

        return self::convertData($data);
    }
}
