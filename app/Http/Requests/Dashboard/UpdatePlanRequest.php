<?php

namespace App\Http\Requests\Dashboard;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlanRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|in:monthly,yearly',
            'description' => 'nullable|string',
            'payment_method' => 'required|in:manual,automatic',
            'is_featured' => 'boolean',
            'highlight_homepage' => 'boolean',
            'priority_support' => 'boolean',
            'analytics_access' => 'boolean',
            'listing_limit' => 'nullable|integer|min:0',
            'image_limit' => 'nullable|integer|min:0',
            'features' => 'nullable|array',
        ];
    }
}
