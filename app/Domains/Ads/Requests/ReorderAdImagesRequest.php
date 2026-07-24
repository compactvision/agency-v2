<?php

namespace App\Domains\Ads\Requests;

use App\Domains\Ads\Models\Ad;
use Illuminate\Foundation\Http\FormRequest;

class ReorderAdImagesRequest extends FormRequest
{
    public function authorize(): bool
    {
        $ad = $this->route('ad');

        return $ad instanceof Ad && $this->user()?->can('manageImages', $ad);
    }

    public function rules(): array
    {
        return [
            'image_ids' => ['required', 'array', 'min:1'],
            'image_ids.*' => ['integer', 'distinct', 'exists:ad_images,id'],
        ];
    }
}
