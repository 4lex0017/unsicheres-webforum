<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

class UserResource extends JsonResource
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
        Log::debug(print_r($this, true));

        return [
            'userId' => $this->id,
            'name' => $this->name,
            'password' => $this->password,
            'birth_date' => $this->birth_date,
            'location' => $this->location,
            'about' => $this->about,
            'groups' => $this->groups,
            'endorsements' => $this->endorsements,
            'profile_picture' => $this->profile_picture,
            'profile_comments' => $this->profile_comments
        ];
    }
}
