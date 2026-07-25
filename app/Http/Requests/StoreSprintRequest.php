<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\NoSpecialChars;

class StoreSprintRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', new NoSpecialChars],
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ];
    }
}
