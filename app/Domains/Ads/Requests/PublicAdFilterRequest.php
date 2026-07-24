<?php

namespace App\Domains\Ads\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PublicAdFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:120'],
            'sale_type' => ['nullable', 'in:sale,rent'],
            'type' => ['nullable', 'string', 'max:100'],
            'municipality_id' => ['nullable', 'integer', 'exists:municipalities,id'],
            'price_min' => ['nullable', 'numeric', 'min:0', 'max:999999999999'],
            'price_max' => ['nullable', 'numeric', 'min:0', 'max:999999999999', 'gte:price_min'],
            'bedrooms' => ['nullable', 'integer', 'min:0', 'max:100'],
            'bathrooms' => ['nullable', 'integer', 'min:0', 'max:100'],
            'amenities' => ['nullable', 'array', 'max:30'],
            'amenities.*' => ['integer', 'distinct', 'exists:amenities,id'],
            'sort' => ['nullable', 'in:newest,low_price,high_price'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:24'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:48'],
        ];
    }
}
