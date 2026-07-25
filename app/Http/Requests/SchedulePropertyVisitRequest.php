<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SchedulePropertyVisitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'phone' => ['required', 'string', 'max:30'],
            'scheduled_at' => ['required', 'date', 'after:now', 'before_or_equal:'.now()->addMonths(6)->toDateTimeString()],
            'message' => ['nullable', 'string', 'max:1500'],
        ];
    }
}
