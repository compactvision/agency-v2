<?php

namespace App\Domains\Ads\Requests;

use App\Domains\Ads\Models\Ad;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAdRequest extends FormRequest
{
    public function authorize(): bool
    {
        $ad = $this->route('ad');

        if (! $ad instanceof Ad && $this->route('id')) {
            $ad = Ad::find($this->route('id'));
        }

        return $ad instanceof Ad && $this->user()?->can('update', $ad);
    }

    public function rules(): array
    {
        return [
            // Champs ADS
            'category_id' => ['sometimes', 'exists:categories,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:20000'],
            'price' => ['sometimes', 'numeric', 'min:0', 'max:999999999999'],
            'currency' => ['sometimes', 'string', 'size:3', 'regex:/^[A-Za-z]{3}$/'],
            'surface' => ['nullable', 'integer', 'min:0', 'max:10000000'],
            'country_id' => ['nullable', 'exists:countries,id'],
            'city_id' => ['nullable', 'exists:cities,id'],
            'municipality_id' => ['nullable', 'exists:municipalities,id'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],

            // Champs RELATIONNELS
            'details' => ['sometimes', 'array'],
            'amenities.add' => ['sometimes', 'array', 'max:30'],
            'amenities.add.*' => ['integer', 'distinct', 'exists:amenities,id'],

            'amenities.remove' => ['sometimes', 'array', 'max:30'],
            'amenities.remove.*' => ['integer', 'distinct', 'exists:amenities,id'],

            // IMAGES
            'images' => ['sometimes', 'array', 'max:20'],
            'images.*' => ['image', 'mimes:jpeg,jpg,png,webp', 'max:5120', 'dimensions:max_width=8000,max_height=8000'],
            'images_to_delete' => ['sometimes', 'array'],
            'images_to_delete.*' => ['integer', 'distinct'],
            'image_order' => ['sometimes', 'array', 'max:40'],
            'image_order.*' => ['string', 'regex:/^(existing|new):\d+$/'],
            'is_published' => ['sometimes', 'boolean'],

        ];
    }
}
