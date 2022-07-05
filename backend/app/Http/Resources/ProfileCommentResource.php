<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class ProfileCommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */

    #[ArrayShape([
        'author' => "mixed",
        'authorName' => "mixed",
        'content' => "mixed",
        'date' => "mixed"
    ])]
    public function toArray($request): array
    {
        return [
            'author' => $this->author,
            'authorName' => $this->name,
            'content' => $this->content,
            'date' => $this->created_at,
        ];
    }
}
