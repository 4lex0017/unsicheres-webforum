<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class ThreadCategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */

    public static $wrap = null;

    #[ArrayShape(['id' => "mixed",
        'title' => "mixed",
        'endorsements' => "mixed",
        'date' => "mixed", 'likedFrom' => "mixed",
        'author' => "mixed"
    ])]
    public function toArray($request): array
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
