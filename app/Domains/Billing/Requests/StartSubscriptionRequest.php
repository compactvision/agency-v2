<?php

namespace App\Domains\Billing\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StartSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        // L'utilisateur doit être authentifié via sanctum (middleware)
        return true;
    }

    public function rules(): array
    {
        return [
            'plan_id' => [
                'required',
                'integer',
                Rule::exists('plans', 'id')->where('is_active', true),
            ],
        ];
    }
}
