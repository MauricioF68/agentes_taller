<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            'project_name' => 'nullable|string|max:255',
            'academic_cycle_id' => 'required|exists:academic_cycles,id',
            'classroom' => 'required|string|max:255',
            'shift' => 'required|string|max:255',
        ];
    }
}
