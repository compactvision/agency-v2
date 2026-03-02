<?php

namespace App\Domains\CMS\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PageSectionResource extends JsonResource
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
            'heading' => $this->heading,
            'paragraph' => $this->paragraph,
            'position' => $this->position,
        ];
    }
}
