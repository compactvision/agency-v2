<?php

namespace App\Domains\Billing\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // protégé par middleware role:admin
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price'       => ['required', 'numeric', 'min:0'],
            'interval'    => ['required', 'string', 'in:monthly,yearly'],
            'is_active'   => ['boolean'],
            'position'    => ['nullable', 'integer'],
        ];
    }
}
