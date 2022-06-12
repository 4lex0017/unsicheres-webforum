<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

use App\Models\Thread;

use Illuminate\Support\Facades\Log;


class ThreadCategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */

    public static $wrap = null;

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'endorsements' => $this->endorsments,
            'date' => $this->created_at,
            'likedFrom' => $this->liked_from,
            'author' => $this->author,
        ];
    }
}
