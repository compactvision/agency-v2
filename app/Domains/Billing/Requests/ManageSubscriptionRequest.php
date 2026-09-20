<?php

namespace App\Domains\Billing\Requests;

use App\Domains\Billing\Models\Subscription;
use Illuminate\Foundation\Http\FormRequest;

class ManageSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage', Subscription::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'in:extend,cancel_now,cancel_at_end'],
            'reason' => ['required', 'string', 'min:5', 'max:1000'],
            'expires_at' => ['required_if:action,extend', 'nullable', 'date', 'after:now'],
        ];
    }
}
