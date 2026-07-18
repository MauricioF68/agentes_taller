<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChatWithAgentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'group_id' => 'required|exists:groups,id',
            'category_slug' => 'nullable|string', 
            'message'  => 'required|string|max:1000',
            'history'  => 'nullable|array'
        ];
    }
}
