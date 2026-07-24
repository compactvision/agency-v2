<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('notifications_enabled')) {
            $this->merge([
                'notifications_enabled' => filter_var($this->notifications_enabled, FILTER_VALIDATE_BOOLEAN),
            ]);
        }

        if ($this->has('newsletter')) {
            $this->merge([
                'newsletter' => filter_var($this->newsletter, FILTER_VALIDATE_BOOLEAN),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],

            'bio' => ['nullable', 'string', 'max:1000'],
            'phone' => ['nullable', 'string', 'max:20'],
            'company' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'language' => ['nullable', 'string', 'in:en,fr'],
            'notifications_enabled' => ['nullable', 'boolean'],
            'newsletter' => ['nullable', 'boolean'],
            'profile_photo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048', 'dimensions:max_width=5000,max_height=5000'],
            'rc_number' => ['nullable', 'string', 'max:255'],
            'tax_number' => ['nullable', 'string', 'max:255'],
            'facebook' => ['nullable', 'url:http,https', 'max:255'],
            'twitter' => ['nullable', 'url:http,https', 'max:255'],
            'instagram' => ['nullable', 'url:http,https', 'max:255'],
            'linkedin' => ['nullable', 'url:http,https', 'max:255'],
        ];
    }
}
