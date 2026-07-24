<?php

namespace App\Domains\Ads\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $isPublished = $this->boolean('is_published');

        return [
            'category_id' => ['required', 'exists:categories,id'],
            'ad_type' => ['required', 'in:sale,rent'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:20000'],
            'price' => [$isPublished ? 'required' : 'nullable', 'numeric', 'min:0', 'max:999999999999'],
            'currency' => ['nullable', 'string', 'size:3', 'regex:/^[A-Za-z]{3}$/'],
            'surface' => ['nullable', 'integer', 'min:0', 'max:10000000'],
            'country_id' => ['nullable', 'exists:countries,id'],
            'city_id' => ['nullable', 'exists:cities,id'],
            'municipality_id' => ['nullable', 'exists:municipalities,id'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'details' => [$isPublished ? 'required' : 'nullable', 'array'],
            'amenities' => ['nullable', 'array', 'max:30'],
            'amenities.*' => ['integer', 'distinct', 'exists:amenities,id'],
            'images' => ['nullable', 'array', 'max:20'],
            'images.*' => ['image', 'mimes:jpeg,jpg,png,webp', 'max:5120', 'dimensions:max_width=8000,max_height=8000'],
            'is_published' => ['nullable', 'boolean'],
        ];
    }
}
