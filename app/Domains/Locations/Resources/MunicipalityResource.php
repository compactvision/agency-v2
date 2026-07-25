<?php

namespace App\Domains\Locations\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MunicipalityResource extends JsonResource
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
            'name' => $this->name,
            'city_id' => $this->city_id,
            'country_id' => $this->city?->country_id,
            'city' => $this->city?->name ?? 'Kinshasa',
            'country' => $this->city?->country?->name ?? 'Congo-Kinshasa',
            'image' => $this->image,
            'image_url' => $this->image_url,
            'properties' => $this->whenCounted('properties'),
            'properties_count' => $this->whenCounted('properties'),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
