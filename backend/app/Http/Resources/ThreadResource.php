<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

use App\Models\Thread;

use Illuminate\Support\Facades\Log;


class ThreadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */

    public static $wrap = null;

    public function toArray($request)
    {
        if (count($this->resource->all()) == 1) {
            if (!$this->resource instanceof Thread) {
                $data = $this->resource->all();
                $user = Thread::find($data[0]->id);
                $this->resource = $user;
            }
        } else {
            return $this->resource;
        }
        return [
            'id' => $this->id,
            'title' => $this->title,
            'date' => $this->created_at,
            'likedFrom' => $this->liked_from,
            'author' => $this->author,
            //'posts' => PostResource::collection($this->posts)
        ];
    }
}
