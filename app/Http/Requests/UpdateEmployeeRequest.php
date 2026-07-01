<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled by policy in controller
    }

    public function rules(): array
    {
        $employeeId = $this->route('employee');

        return [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:employees,email,' . $employeeId . '|max:255',
            'phone' => 'sometimes|string|max:20',
            'department' => 'sometimes|nullable|string|max:255',
            'position' => 'sometimes|nullable|string|max:255',
            'status' => 'sometimes|in:active,inactive,terminated',
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email is already in use',
        ];
    }
}
