<?php

namespace App\Domains\Ads\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RejectAdRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'max:1000'],
        ];
    }
}
