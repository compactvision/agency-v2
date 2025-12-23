<?php

namespace App\Domains\Amenities\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAmenityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'       => ['required', 'string', 'max:255'],
            'is_active'  => ['boolean'],
            'position'   => ['nullable', 'integer'],
        ];
    }
}
