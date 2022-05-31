<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */

    public static $wrap = null;

    // TODO: FIX ME ONCE UPDATED IN CONFLUENCE

    public function toArray($request)
    {
        return [
            'thread_id' => $this->thread_id,
            'poster_id' => $this->poster_id,
            'thread_title' => $this->thread_title,
            'tags' => $this->tags,
            'thread_prefix' => $this->thread_prefix,
            'posts' => $this->posts
        ];
    }
}
