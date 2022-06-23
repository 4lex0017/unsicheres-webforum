<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;
use JsonSerializable;
use Illuminate\Contracts\Support\Arrayable;
use App\Models\User;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array|Arrayable|JsonSerializable
     */

    public static $wrap = null;

    #[ArrayShape([
        'id' => "mixed",
        'content' => "mixed",
        'date' => "mixed",
        'likedFrom' => "mixed",
        'author' => "mixed"
    ])]
    private static function convertData($data): array
    {
        return [
            'id' => $data->id,
            'content' => $data->content,
            'date' => $data->created_at,
            'likedFrom' => $data->liked_from,
            'author' => $data->author,
        ];
    }

    #[ArrayShape([
        'id' => "mixed",
        'content' => "mixed",
        'date' => "mixed",
        'likedFrom' => "mixed",
        'author' => "mixed"
    ])]
    public function toArray($request): array|JsonSerializable|Arrayable
    {
        $author = (new User)->find($this->author);

        $this->author = [
            'id' => $this->author,
            'profilePicture' => $author->profile_picture,
            'name' => $author->name,
        ];

        return self::convertData($this);
    }
}
