<?php

namespace App\Domains\Auth\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BecomeSellerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'            => ['required', 'string', 'max:255'],
            'phone'           => ['required', 'string', 'max:50'],
            'bio'             => ['nullable', 'string'],
            'company'         => ['required_if:user_type,agency', 'nullable', 'string', 'max:255'],
            'rc_number'       => ['nullable', 'string', 'max:255'],
            'tax_number'      => ['nullable', 'string', 'max:255'],
            'user_type'       => ['required', 'string', 'in:seller,agency'],
            'country_id'      => ['nullable', 'exists:countries,id'],
            'city_id'         => ['nullable', 'exists:cities,id'],
            'municipality_id' => ['nullable', 'exists:municipalities,id'],
            'address'         => ['nullable', 'string', 'max:255'],
            'profile_photo'   => ['nullable', 'image', 'max:2048'],
        ];
    }
}

