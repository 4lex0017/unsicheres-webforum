<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ThreadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'thread_id' => $this->thread_id,
            'poster_id' => $this->poster_id,
            'thread_title' => $this->thread_title,
            'tags' => $this->tags,
            'thread_prefix' => $this->thread_prefix,
            'posts' => PostResource::collection($this->posts)
        ];
    }
}
