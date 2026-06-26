<?php

namespace App\Domains\Ads\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdResource extends JsonResource
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
            'reference' => $this->reference,
            'title' => $this->title,
            'description' => $this->description,
            'price' => $this->price,
            'currency' => $this->currency,
            'surface' => $this->surface,
            'ad_type' => $this->ad_type,
            'sale_type' => $this->ad_type,
            'status' => $this->status,
            'is_published' => $this->is_published,
            'is_approved' => (bool) $this->is_approved,
            'rejection_reason' => $this->rejection_reason,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'category' => $this->whenLoaded('category', fn() => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'slug' => $this->category?->slug,
            ]),
            'user' => $this->whenLoaded('user', fn() => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'email' => $this->user?->email,
                'phone' => $this->user?->phone,
            ]),
            'municipality' => $this->whenLoaded('municipality', fn() => [
                'id' => $this->municipality?->id,
                'name' => $this->municipality?->name,
            ]),
            'city' => $this->whenLoaded('city', fn() => [
                'id' => $this->city?->id,
                'name' => $this->city?->name,
            ]),
            'country' => $this->whenLoaded('country', fn() => [
                'id' => $this->country?->id,
                'name' => $this->country?->name,
            ]),
            'details' => $this->whenLoaded('details', fn() => $this->details?->details),
            'images' => $this->whenLoaded('images', fn() => $this->images?->map(fn($img) => [
                'id' => $img->id,
                'path' => $img->path,
                'position' => $img->position,
                'url' => $img->path, // Frontend expects relative path for /storage/ prefixing
                'full_url' => asset('storage/' . $img->path),
            ])),
            'amenities' => $this->whenLoaded('amenities', fn() => $this->amenities?->map(fn($amenity) => [
                'id' => $amenity->id,
                'name' => $amenity->name,
            ])),
            'created_at' => $this->created_at?->toIso8601String(),
        ] + ($this->relationLoaded('details') ? ($this->details?->details ?? []) : []);
    }
}
