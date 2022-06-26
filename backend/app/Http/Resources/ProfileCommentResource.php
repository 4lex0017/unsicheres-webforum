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
        'profileId' => "mixed",
        'author' => "mixed",
        'content' => "mixed",
        'date' => "mixed"
    ])]
    public function toArray($request): array
    {
        return [
            'profileId' => $this->profile_id,
            'author' => $this->author,
            'content' => $this->content,
            'date' => $this->created_at,
        ];
    }
}
