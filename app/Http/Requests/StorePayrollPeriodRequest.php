<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePayrollPeriodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'start_date' => 'required|date|date_format:Y-m-d',
            'end_date' => 'required|date|date_format:Y-m-d|after:start_date',
            'payment_date' => 'required|date|date_format:Y-m-d|after_or_equal:end_date',
            'frequency' => 'required|in:weekly,biweekly,monthly,annual',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'end_date.after' => 'End date must be after start date',
            'payment_date.after_or_equal' => 'Payment date must be on or after end date',
        ];
    }
}
