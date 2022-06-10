<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */

    public static $wrap = null;

    private static function convertData($data): array
    {
        return [
            'userId' => $data->id,
            'username' => $data->name,
            'joined' => $data->created_at,
            'birthDate' => $data->birth_date,
            'location' => $data->location,
            'about' => $data->about,
            'groups' => $data->groups,
            'endorsements' => $data->endorsements,
            'profilePicture' => $data->profile_picture,
            'profileComments' => $data->profile_comments
        ];
    }

    public function toArray($request): array
    {
        if (!is_a($this->resource, 'Illuminate\Support\Collection')) {
            $data = $this;
        } else {
            if (count($this->resource) === 0)
                return [];

            $data = $this->resource[0];
        }

        return self::convertData($data);
    }
}
