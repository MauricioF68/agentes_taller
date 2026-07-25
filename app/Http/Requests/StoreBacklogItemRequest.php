<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\NoSpecialChars;

class StoreBacklogItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255', new NoSpecialChars],
            'description' => ['nullable', 'string', new NoSpecialChars],
            'acceptance_criteria' => ['nullable', 'string', new NoSpecialChars],
            'type' => 'nullable|string',
            'status' => 'nullable|string',
            'story_points' => 'nullable|integer|min:1|max:5',
            'sprint' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
        ];
    }
}
