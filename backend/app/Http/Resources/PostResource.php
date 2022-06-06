<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */

    public static $wrap = null;

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'threadId' => $this->thread_id,
            'content' => $this->content,
            'date' => $this->created_at,
            'likedFrom' => PostResource::collection($this->liked_from),
            'author' => $this->author,
        ];
    }
}
