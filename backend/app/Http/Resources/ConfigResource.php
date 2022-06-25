<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ConfigResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'uri' => $this->uri,
            'sqli_difficulty' => $this->sqli_difficulty,
            'sxss_difficulty' => $this->sxss_difficulty,
            'rxss_difficulty' => $this->rxss_difficulty,
            'cmdi_difficulty' => $this->cmdi_difficulty,
        ];
    }
}
