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
            'city' => $this->city?->name ?? 'Kinshasa',
            'country' => 'Congo-Kinshasa',
            'properties_count' => $this->whenCounted('properties'),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
