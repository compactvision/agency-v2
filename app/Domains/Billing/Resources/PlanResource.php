<?php

namespace App\Domains\Billing\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'description' => $this->description,
            'price'       => $this->price,
            'interval'    => $this->interval,
            'is_active'   => $this->is_active,
            'position'    => $this->position,
            'features'    => PlanFeatureResource::collection($this->whenLoaded('features')),
            'created_at'  => $this->created_at?->toIso8601String(),
            'updated_at'  => $this->updated_at?->toIso8601String(),
        ];
    }
}
