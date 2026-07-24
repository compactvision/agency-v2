<?php

namespace App\Domains\Ads\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class AdSummaryResource extends JsonResource
{
    /**
     * Lightweight representation used by cards and paginated lists.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $details = $this->relationLoaded('details')
            ? ($this->details?->details ?? [])
            : [];
        $image = $this->relationLoaded('primaryImage')
            ? $this->primaryImage
            : null;
        $serializedImage = $image ? [
            'id' => $image->id,
            'url' => $image->path,
            'full_url' => asset('storage/'.$image->path),
        ] : null;

        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'slug' => $this->slug,
            'title' => $this->title,
            'description' => Str::limit(strip_tags((string) $this->description), 180),
            'price' => $this->price,
            'currency' => $this->currency,
            'surface' => $this->surface,
            'ad_type' => $this->ad_type,
            'sale_type' => $this->ad_type,
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'slug' => $this->category?->slug,
            ]),
            'municipality' => $this->whenLoaded('municipality', fn () => [
                'id' => $this->municipality?->id,
                'name' => $this->municipality?->name,
            ]),
            'bedrooms' => $details['bedrooms'] ?? null,
            'bathrooms' => $details['bathrooms'] ?? null,
            'rooms' => $details['rooms'] ?? null,
            'image' => $serializedImage,
            // Kept as a one-item array while existing cards migrate to `image`.
            'images' => $serializedImage ? [$serializedImage] : [],
            'images_count' => $this->whenCounted('images'),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
