<?php

namespace App\Http\Resources;


use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;
use JsonSerializable;


class SmallPostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */

    public static $wrap = null;

    #[ArrayShape([
        'postId' => "mixed",
        'threadId' => "mixed",
        'content' => "mixed",
        'date' => "mixed"
    ])]
    public function toArray($request): array|JsonSerializable|Arrayable
    {
        return [
            'postId' => $this->id,
            'threadId' => $this->thread_id,
            'content' => $this->content,
            'date' => $this->created_at,
        ];
    }
}
