<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled by policy in controller
    }

    public function rules(): array
    {
        return [
            'employee_id' => 'required|string|unique:employees|max:50',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees|max:255',
            'phone' => 'required|string|max:20',
            'hire_date' => 'required|date|before_or_equal:today',
            'employment_type' => 'required|in:full_time,part_time,contract',
            'status' => 'required|in:active,inactive,terminated',
            'department' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'employee_id.unique' => 'This employee ID already exists',
            'email.unique' => 'This email is already registered',
            'hire_date.before_or_equal' => 'Hire date cannot be in the future',
        ];
    }
}
