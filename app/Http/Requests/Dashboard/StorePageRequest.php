<?php

namespace App\Http\Requests\Dashboard;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasRole(['admin', 'super-admin']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'status' => 'nullable|in:draft,published',
            'meta_title' => 'nullable|string|max:65',
            'meta_description' => 'nullable|string|max:160',
            'og_image' => 'nullable|url:http,https|max:2048',
            'noindex' => 'nullable|boolean',
            'sections' => 'nullable|array',
            'sections.*.heading' => 'nullable|string|max:255',
            'sections.*.paragraph' => 'nullable|string',
        ];
    }
}
