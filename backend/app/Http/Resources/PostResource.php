<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;
use Illuminate\Contracts\Support\Arrayable;

use App\Models\User;

use Illuminate\Support\Facades\Log;


class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */

    public static $wrap = null;

    private static function convertData($data): array
    {
        return [
            'id' => $data->id,
            'threadId' => $data->thread_id,
            'content' => $data->content,
            'date' => $data->created_at,
            'likedFrom' => $data->liked_from,
            'author' => $data->author,
        ];
    }

    public function toArray($request): array|JsonSerializable|Arrayable
    {
        if (is_a($this->resource, 'App\Models\Post')) {
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
        return self::convertData($data);
    }
}
