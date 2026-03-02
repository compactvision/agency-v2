<?php

namespace App\Domains\CMS\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'status' => $this->status,
            'sections' => PageSectionResource::collection($this->whenLoaded('sections')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
