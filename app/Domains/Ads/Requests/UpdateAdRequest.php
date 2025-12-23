<?php

namespace App\Domains\Ads\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Champs ADS
            'category_id' => ['sometimes', 'exists:categories,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'string', 'size:3'],
            'surface' => ['nullable', 'integer', 'min:0'],
            'country_id' => ['nullable', 'exists:countries,id'],
            'city_id' => ['nullable', 'exists:cities,id'],
            'municipality_id' => ['nullable', 'exists:municipalities,id'],

            // Champs RELATIONNELS
            'details' => ['sometimes', 'array'],
            'amenities.add' => ['sometimes', 'array'],
            'amenities.add.*' => ['exists:amenities,id'],

            'amenities.remove' => ['sometimes', 'array'],
            'amenities.remove.*' => ['exists:amenities,id'],

        ];
    }
}
