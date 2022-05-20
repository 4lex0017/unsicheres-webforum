<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'user_id' => $this->user_id,
            'password' => $this->password,
            'name' => $this->name,
            'score' => $this->score,
            'message_count' => $this->message_count,
            'profile_picture' => $this->profile_picture,
            'description' => $this->description,
            'birth_date' => $this->birth_date,
            'location' => $this->location
        ];
    }
}
