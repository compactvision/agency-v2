<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactOwnerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'phone' => ['nullable', 'string', 'max:30'],
            'message' => ['required', 'string', 'min:10', 'max:3000'],
        ];
    }
}
