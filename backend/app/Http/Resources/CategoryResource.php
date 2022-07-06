<?php

namespace App\Http\Resources;

use App\Models\Category;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;


class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */

    public static $wrap = null;

    public function toArray($request): Model|Collection|array|Category|JsonSerializable|Arrayable|null
    {
        if (count($this->resource->all()) == 1) {
            if (!$this->resource instanceof Category) {
                $data = $this->resource->all();
                $category = (new Category)->find($data[0]->id);
                $this->resource = $category;
            }
        } else {
            return $this->resource;
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'threads' => ThreadCategoryResource::collection($this->threads),
        ];
    }
}
