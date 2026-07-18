<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EvaluateGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'group_id' => 'required|exists:groups,id',
            'color_status' => 'required|string|in:calavera,enojado,rojo,naranja,amarillo,verde',
            'feedback' => 'nullable|string|max:1000'
        ];
    }
}
