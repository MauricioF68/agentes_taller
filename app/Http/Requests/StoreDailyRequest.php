<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDailyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'achievements_text' => 'required|string',
            'plans_text' => 'required|string',
            'impediments' => 'nullable|string',
            'yesterday_items' => 'nullable|array',
            'today_items' => 'nullable|array',
        ];
    }
}
