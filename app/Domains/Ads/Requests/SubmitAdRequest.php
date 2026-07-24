<?php

namespace App\Domains\Ads\Requests;

use App\Domains\Ads\Models\Ad;
use Illuminate\Foundation\Http\FormRequest;

class SubmitAdRequest extends FormRequest
{
    public function authorize(): bool
    {
        $ad = $this->route('ad');

        return $ad instanceof Ad && $this->user()?->can('submit', $ad);
    }

    public function rules(): array
    {
        return [];
    }
}
