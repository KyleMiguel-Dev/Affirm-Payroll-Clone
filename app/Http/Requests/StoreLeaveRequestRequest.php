<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeaveRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => 'required|exists:users,id',
            'leave_type' => 'required|in:sick,vacation,personal,unpaid,other',
            'start_date' => 'required|date|date_format:Y-m-d|after_or_equal:today',
            'end_date' => 'required|date|date_format:Y-m-d|after_or_equal:start_date',
            'duration_type' => 'required|in:full_day,half_day_morning,half_day_afternoon',
            'reason' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'start_date.after_or_equal' => 'Leave cannot start in the past',
            'end_date.after_or_equal' => 'End date must be on or after start date',
        ];
    }
}
