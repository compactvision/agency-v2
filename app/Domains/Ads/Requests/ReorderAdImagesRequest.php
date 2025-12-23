<?php

namespace App\Domains\Ads\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderAdImagesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'image_ids'   => ['required', 'array'],
            'image_ids.*' => ['exists:ad_images,id'],
        ];
    }
}
