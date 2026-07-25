<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\NoSpecialChars;

class StoreDailyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'achievements_text' => ['required', 'string', new NoSpecialChars],
            'plans_text' => ['required', 'string', new NoSpecialChars],
            'impediments' => ['nullable', 'string', new NoSpecialChars],
            'yesterday_items' => 'nullable|array',
            'today_items' => 'nullable|array',
        ];
    }
}
