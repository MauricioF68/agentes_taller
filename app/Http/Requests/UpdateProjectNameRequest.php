<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\NoSpecialChars;

class UpdateProjectNameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_name' => ['required', 'string', 'max:255', new NoSpecialChars],
        ];
    }
}
