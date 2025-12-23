<?php

namespace App\Domains\Locations\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MunicipalityResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'      => $this->id,
            'name'    => $this->name,

            'city' => [
                'id'   => $this->city?->id,
                'name' => $this->city?->name,
            ],

            'country' => [
                'id'   => $this->city?->country?->id,
                'name' => $this->city?->country?->name,
            ],

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
