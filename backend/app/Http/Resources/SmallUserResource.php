<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;

class SmallUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */

    public static $wrap = null;

    #[ArrayShape(['userId' => "mixed", 'username' => "mixed"])]
    public function toArray($request): array
    {
        return [
            'userId' => $this->resource[0]->id,
            'username' => $this->resource[0]->name,
        ];
    }
}
