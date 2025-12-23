<?php

namespace App\Domains\Billing\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // protégé par middleware role:admin
    }

    public function rules(): array
    {
        return [
            'name'        => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'price'       => ['sometimes', 'numeric', 'min:0'],
            'interval'    => ['sometimes', 'string', 'in:monthly,yearly'],
            'is_active'   => ['sometimes', 'boolean'],
            'position'    => ['sometimes', 'integer'],
        ];
    }
}
