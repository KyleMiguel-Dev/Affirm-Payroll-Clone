<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\Employee;
use App\Models\User;
use App\Models\PayrollPeriod;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;

class ControllerErrorHandlingTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Employee $employee;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
        $this->employee = Employee::factory()->create();
    }

    // EmployeeController Tests

    public function test_create_employee_returns_201_on_success()
    {
        $response = $this->postJson('/api/employees', [
            'employee_id' => 'EMP001',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'phone' => '555-0100',
            'hire_date' => '2024-01-01',
            'employment_type' => 'full_time',
            'status' => 'active',
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('email', 'john@example.com');
    }

    public function test_create_employee_logs_action()
    {
        Log::spy();

        $this->postJson('/api/employees', [
            'employee_id' => 'EMP001',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'phone' => '555-0100',
            'hire_date' => '2024-01-01',
            'employment_type' => 'full_time',
            'status' => 'active',
        ]);

        Log::shouldHaveReceived('info');
    }

    public function test_update_employee_returns_200_on_success()
    {
        $response = $this->putJson("/api/employees/{$this->employee->id}", [
            'first_name' => 'Jane',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('first_name', 'Jane');
    }

    public function test_update_employee_logs_changes()
    {
        Log::spy();

        $this->putJson("/api/employees/{$this->employee->id}", [
            'first_name' => 'Jane',
        ]);

        Log::shouldHaveReceived('info');
    }

    public function test_delete_employee_returns_204_on_success()
    {
        $response = $this->deleteJson("/api/employees/{$this->employee->id}");

        $response->assertStatus(204);
    }

    public function test_delete_employee_logs_action()
    {
        Log::spy();

        $this->deleteJson("/api/employees/{$this->employee->id}");

        Log::shouldHaveReceived('info');
    }

    public function test_terminate_employee_logs_termination()
    {
        Log::spy();

        $this->postJson("/api/employees/{$this->employee->id}/terminate", [
            'termination_date' => now()->toDateString(),
        ]);

        Log::shouldHaveReceived('info');
    }

    // PayrollPeriodController Tests

    public function test_create_payroll_period_returns_201()
    {
        $response = $this->postJson('/api/payroll-periods', [
            'start_date' => '2024-01-01',
            'end_date' => '2024-01-15',
            'payment_date' => '2024-01-20',
            'frequency' => 'biweekly',
        ]);

        $response->assertStatus(201);
    }

    public function test_create_payroll_period_logs_event()
    {
        Log::spy();

        $this->postJson('/api/payroll-periods', [
            'start_date' => '2024-01-01',
            'end_date' => '2024-01-15',
            'payment_date' => '2024-01-20',
            'frequency' => 'biweekly',
        ]);

        Log::shouldHaveReceived('info');
    }

    public function test_lock_payroll_period_throws_exception_if_already_locked()
    {
        $period = PayrollPeriod::factory()->create(['status' => 'locked']);

        $response = $this->postJson("/api/payroll-periods/{$period->id}/lock");

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'Payroll period is already locked');
    }

    public function test_mark_paid_throws_exception_if_not_locked()
    {
        $period = PayrollPeriod::factory()->create(['status' => 'open']);

        $response = $this->postJson("/api/payroll-periods/{$period->id}/mark-paid");

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'Payroll period must be locked before marking as paid');
    }

    public function test_update_period_throws_exception_if_closed()
    {
        $period = PayrollPeriod::factory()->create(['status' => 'locked']);

        $response = $this->putJson("/api/payroll-periods/{$period->id}", [
            'frequency' => 'monthly',
        ]);

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'Cannot modify closed payroll period');
    }

    // PayslipController Tests

    public function test_generate_payslips_throws_exception_if_period_not_open()
    {
        $period = PayrollPeriod::factory()->create(['status' => 'locked']);

        $response = $this->postJson("/api/payroll-periods/{$period->id}/generate");

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'Payroll period is not open');
    }

    public function test_calculate_payslip_preview_throws_exception_for_missing_employee()
    {
        $period = PayrollPeriod::factory()->create();

        $response = $this->postJson('/api/payslips/preview', [
            'employee_id' => 9999,
            'payroll_period_id' => $period->id,
        ]);

        $response->assertStatus(404);
        $response->assertJsonPath('message', 'Employee not found');
    }

    public function test_calculate_payslip_preview_throws_exception_for_missing_period()
    {
        $response = $this->postJson('/api/payslips/preview', [
            'employee_id' => $this->employee->id,
            'payroll_period_id' => 9999,
        ]);

        $response->assertStatus(404);
        $response->assertJsonPath('message', 'PayrollPeriod not found');
    }

    // LeaveRequestController Tests

    public function test_create_leave_request_logs_action()
    {
        Log::spy();

        $this->postJson('/api/leave-requests', [
            'employee_id' => $this->employee->id,
            'leave_type' => 'vacation',
            'start_date' => now()->addDay()->toDateString(),
            'end_date' => now()->addDays(3)->toDateString(),
            'duration_type' => 'full_day',
        ]);

        Log::shouldHaveReceived('info');
    }

    public function test_approve_leave_request_logs_approval()
    {
        $leaveRequest = $this->employee->leaveRequests()->create([
            'leave_type' => 'vacation',
            'start_date' => now()->addDay(),
            'end_date' => now()->addDays(3),
            'duration_type' => 'full_day',
            'status' => 'pending',
        ]);

        Log::spy();

        $this->postJson("/api/leave-requests/{$leaveRequest->id}/approve");

        Log::shouldHaveReceived('info');
    }

    // AttendanceController Tests

    public function test_record_attendance_validates_checkout_after_checkin()
    {
        $response = $this->postJson("/api/employees/{$this->employee->id}/attendance", [
            'date' => now()->toDateString(),
            'check_in_time' => '17:00:00',
            'check_out_time' => '09:00:00',  // Before check-in
            'status' => 'present',
        ]);

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'Check-out time must be after check-in time');
    }

    public function test_record_attendance_logs_action()
    {
        Log::spy();

        $this->postJson("/api/employees/{$this->employee->id}/attendance", [
            'date' => now()->toDateString(),
            'check_in_time' => '09:00:00',
            'check_out_time' => '17:00:00',
            'status' => 'present',
        ]);

        Log::shouldHaveReceived('info');
    }

    // Error Response Format Tests

    public function test_validation_error_response_format()
    {
        $response = $this->postJson('/api/employees', [
            'email' => 'invalid',
        ]);

        expect($response->json())->toHaveKeys(['status', 'message', 'errors', 'timestamp']);
        expect($response->json('status'))->toBe('error');
    }

    public function test_business_logic_error_response_format()
    {
        $period = PayrollPeriod::factory()->create(['status' => 'locked']);

        $response = $this->postJson("/api/payroll-periods/{$period->id}/lock");

        expect($response->json())->toHaveKeys(['status', 'message', 'timestamp']);
        expect($response->json('status'))->toBe('error');
    }

    public function test_not_found_error_response_format()
    {
        $response = $this->getJson('/api/employees/9999');

        expect($response->status())->toBe(404);
        expect($response->json('status'))->toBe('error');
    }

    public function test_all_error_responses_include_timestamp()
    {
        $period = PayrollPeriod::factory()->create(['status' => 'locked']);

        $response = $this->postJson("/api/payroll-periods/{$period->id}/lock");

        expect($response->json('timestamp'))->toMatch('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.000Z$/');
    }
}
