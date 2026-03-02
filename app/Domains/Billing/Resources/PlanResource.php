<?php

namespace App\Domains\Billing\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $features = $this->features;
        
        // Metadata keys to extract from features
        $metadataKeys = [
            'listing_limit', 'image_limit', 'is_featured', 
            'highlight_homepage', 'priority_support', 'analytics_access'
        ];
        
        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'duration' => $this->interval,
            'payment_method' => $this->payment_method,
        ];

        foreach ($metadataKeys as $key) {
            $feature = $features->firstWhere('name', $key);
            $value = $feature ? $feature->value : null;
            
            // Handle boolean casting
            if (str_starts_with($key, 'is_') || str_ends_with($key, '_access') || str_contains($key, 'support') || str_contains($key, 'homepage')) {
                $data[$key] = filter_var($value, FILTER_VALIDATE_BOOLEAN);
            } else {
                $data[$key] = $value;
            }
        }

        // For the UI features list (bullet points), exclude metadata keys
        $data['features'] = $features->reject(fn($f) => in_array($f->name, $metadataKeys))
            ->map(fn($f) => ['name' => $f->name])
            ->values();

        return $data;
    }
}
