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
            'phone'           => ['required', 'string', 'max:50'],
            'country_id'      => ['required', 'exists:countries,id'],
            'city_id'         => ['required', 'exists:cities,id'],
            'municipality_id' => ['required', 'exists:municipalities,id'],
            'address'         => ['required', 'string', 'max:255'],
            'profile_photo'   => ['nullable', 'string', 'max:255'],
        ];
    }
}

