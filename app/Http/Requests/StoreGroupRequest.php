<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\NoSpecialChars;

class StoreGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255', new NoSpecialChars],
            'project_name' => ['nullable', 'string', 'max:255', new NoSpecialChars],
            'academic_cycle_id' => 'required|exists:academic_cycles,id',
            'classroom' => ['required', 'string', 'max:255', new NoSpecialChars],
            'shift' => ['required', 'string', 'max:255', new NoSpecialChars],
        ];
    }
}
