<?php

namespace App\Domains\Ads\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'ad_type'     => ['required', 'in:sale,rent'],
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price'       => ['required', 'numeric', 'min:0'],
            'currency'    => ['nullable', 'string', 'max:3'],
            'surface'     => ['nullable', 'integer'],
            'country_id'  => ['nullable', 'exists:countries,id'],
            'city_id'     => ['nullable', 'exists:cities,id'],
            'municipality_id' => ['nullable', 'exists:municipalities,id'],
            'latitude'    => ['nullable', 'numeric'],
            'longitude'    => ['nullable', 'numeric'],
            'details'     => ['required', 'array'],
            'amenities'   => ['nullable', 'array'],
            'amenities.*' => ['exists:amenities,id'],
        ];
    }
}
