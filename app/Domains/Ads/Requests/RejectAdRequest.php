<?php

namespace App\Domains\Ads\Requests;

use App\Domains\Ads\Models\Ad;
use Illuminate\Foundation\Http\FormRequest;

class RejectAdRequest extends FormRequest
{
    public function authorize(): bool
    {
        $ad = $this->route('ad');

        return $ad instanceof Ad && $this->user()?->can('moderate', $ad);
    }

    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'max:1000'],
        ];
    }
}
