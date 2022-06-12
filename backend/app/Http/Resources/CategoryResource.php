<?php

namespace App\Http\Resources;

use App\Models\Category;
use Illuminate\Http\Resources\Json\JsonResource;

use App\Models\Thread;

use Illuminate\Support\Facades\Log;


class CategoryResource extends JsonResource
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
        if (count($this->resource->all()) == 1) {
            if (!$this->resource instanceof Category) {
                $data = $this->resource->all();
                $category = Category::find($data[0]->id);
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
