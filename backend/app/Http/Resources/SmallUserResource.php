<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SmallUserResource extends JsonResource
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
            'userId' => $this->user_id,
            'namename' => $this->name,
        ];
    }
}
