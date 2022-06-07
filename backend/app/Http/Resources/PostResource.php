<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

use App\Models\Post;

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

    public function toArray($request)
    {
        Log::debug(print_r($this, true));
        if (count($this->resource->all()) == 1) {
            if (!$this->resource instanceof Post) {
                $data = $this->resource->all();
                $post = Post::find($data[0]->id);
                $this->resource = $post;
            }
        } else {
            return $this->resource;
        }
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
