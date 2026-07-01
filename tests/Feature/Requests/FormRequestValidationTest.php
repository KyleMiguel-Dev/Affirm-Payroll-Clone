<?php

namespace Tests\Feature\Requests;

use Tests\TestCase;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Http\Requests\StorePayrollPeriodRequest;
use App\Http\Requests\StoreLeaveRequestRequest;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class FormRequestValidationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->actingAs(User::factory()->create());
    }

    // StoreEmployeeRequest Tests

    public function test_store_employee_requires_employee_id()
    {
        $response = $this->postJson('/api/employees', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'phone' => '555-0100',
            'hire_date' => '2024-01-01',
            'employment_type' => 'full_time',
            'status' => 'active',
        ]);

        $response->assertStatus(422);
        $response->assertJsonPath('errors.employee_id.0', 'The employee_id field is required.');
    }

    public function test_store_employee_requires_unique_employee_id()
    {
        Employee::factory()->create(['employee_id' => 'EMP001']);

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

        $response->assertStatus(422);
        expect($response->json('errors.employee_id'))->toBeDefined();
    }

    public function test_store_employee_requires_valid_email()
    {
        $response = $this->postJson('/api/employees', [
            'employee_id' => 'EMP001',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'invalid-email',
            'phone' => '555-0100',
            'hire_date' => '2024-01-01',
            'employment_type' => 'full_time',
            'status' => 'active',
        ]);

        $response->assertStatus(422);
        expect($response->json('errors.email'))->toBeDefined();
    }

    public function test_store_employee_requires_unique_email()
    {
        Employee::factory()->create(['email' => 'john@example.com']);

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

        $response->assertStatus(422);
        expect($response->json('errors.email'))->toBeDefined();
    }

    public function test_store_employee_requires_valid_hire_date()
    {
        $response = $this->postJson('/api/employees', [
            'employee_id' => 'EMP001',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'phone' => '555-0100',
            'hire_date' => '2025-12-31',  // Future date
            'employment_type' => 'full_time',
            'status' => 'active',
        ]);

        $response->assertStatus(422);
        expect($response->json('errors.hire_date'))->toBeDefined();
    }

    public function test_store_employee_requires_valid_employment_type()
    {
        $response = $this->postJson('/api/employees', [
            'employee_id' => 'EMP001',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'phone' => '555-0100',
            'hire_date' => '2024-01-01',
            'employment_type' => 'invalid_type',
            'status' => 'active',
        ]);

        $response->assertStatus(422);
        expect($response->json('errors.employment_type'))->toBeDefined();
    }

    public function test_store_employee_valid_request()
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
    }

    // UpdateEmployeeRequest Tests

    public function test_update_employee_allows_partial_data()
    {
        $employee = Employee::factory()->create();

        $response = $this->putJson("/api/employees/{$employee->id}", [
            'first_name' => 'Jane',
        ]);

        $response->assertStatus(200);
        expect($response->json('first_name'))->toBe('Jane');
    }

    public function test_update_employee_email_must_be_unique()
    {
        $employee1 = Employee::factory()->create(['email' => 'john@example.com']);
        $employee2 = Employee::factory()->create(['email' => 'jane@example.com']);

        $response = $this->putJson("/api/employees/{$employee2->id}", [
            'email' => 'john@example.com',
        ]);

        $response->assertStatus(422);
        expect($response->json('errors.email'))->toBeDefined();
    }

    public function test_update_employee_allows_same_email()
    {
        $employee = Employee::factory()->create(['email' => 'john@example.com']);

        $response = $this->putJson("/api/employees/{$employee->id}", [
            'email' => 'john@example.com',
        ]);

        $response->assertStatus(200);
    }

    // StorePayrollPeriodRequest Tests

    public function test_store_payroll_period_requires_dates()
    {
        $response = $this->postJson('/api/payroll-periods', [
            'frequency' => 'monthly',
        ]);

        $response->assertStatus(422);
        expect($response->json('errors.start_date'))->toBeDefined();
        expect($response->json('errors.end_date'))->toBeDefined();
        expect($response->json('errors.payment_date'))->toBeDefined();
    }

    public function test_store_payroll_period_end_date_must_be_after_start()
    {
        $response = $this->postJson('/api/payroll-periods', [
            'start_date' => '2024-01-15',
            'end_date' => '2024-01-01',  // Before start_date
            'payment_date' => '2024-01-20',
            'frequency' => 'monthly',
        ]);

        $response->assertStatus(422);
        expect($response->json('errors.end_date'))->toBeDefined();
    }

    public function test_store_payroll_period_payment_date_must_be_after_end()
    {
        $response = $this->postJson('/api/payroll-periods', [
            'start_date' => '2024-01-01',
            'end_date' => '2024-01-15',
            'payment_date' => '2024-01-10',  // Before end_date
            'frequency' => 'monthly',
        ]);

        $response->assertStatus(422);
        expect($response->json('errors.payment_date'))->toBeDefined();
    }

    public function test_store_payroll_period_requires_valid_frequency()
    {
        $response = $this->postJson('/api/payroll-periods', [
            'start_date' => '2024-01-01',
            'end_date' => '2024-01-15',
            'payment_date' => '2024-01-20',
            'frequency' => 'invalid_frequency',
        ]);

        $response->assertStatus(422);
        expect($response->json('errors.frequency'))->toBeDefined();
    }

    public function test_store_payroll_period_valid_request()
    {
        $response = $this->postJson('/api/payroll-periods', [
            'start_date' => '2024-01-01',
            'end_date' => '2024-01-15',
            'payment_date' => '2024-01-20',
            'frequency' => 'monthly',
            'notes' => 'Monthly payroll',
        ]);

        $response->assertStatus(201);
    }

    // StoreLeaveRequestRequest Tests

    public function test_store_leave_request_requires_valid_employee()
    {
        $response = $this->postJson('/api/leave-requests', [
            'employee_id' => 999,  // Non-existent
            'leave_type' => 'vacation',
            'start_date' => now()->addDay()->toDateString(),
            'end_date' => now()->addDays(3)->toDateString(),
            'duration_type' => 'full_day',
        ]);

        $response->assertStatus(422);
        expect($response->json('errors.employee_id'))->toBeDefined();
    }

    public function test_store_leave_request_requires_valid_leave_type()
    {
        $employee = Employee::factory()->create();

        $response = $this->postJson('/api/leave-requests', [
            'employee_id' => $employee->id,
            'leave_type' => 'invalid_type',
            'start_date' => now()->addDay()->toDateString(),
            'end_date' => now()->addDays(3)->toDateString(),
            'duration_type' => 'full_day',
        ]);

        $response->assertStatus(422);
        expect($response->json('errors.leave_type'))->toBeDefined();
    }

    public function test_store_leave_request_start_date_cannot_be_past()
    {
        $employee = Employee::factory()->create();

        $response = $this->postJson('/api/leave-requests', [
            'employee_id' => $employee->id,
            'leave_type' => 'vacation',
            'start_date' => now()->subDay()->toDateString(),  // Past date
            'end_date' => now()->addDays(3)->toDateString(),
            'duration_type' => 'full_day',
        ]);

        $response->assertStatus(422);
        expect($response->json('errors.start_date'))->toBeDefined();
    }

    public function test_store_leave_request_end_date_must_be_after_start()
    {
        $employee = Employee::factory()->create();

        $response = $this->postJson('/api/leave-requests', [
            'employee_id' => $employee->id,
            'leave_type' => 'vacation',
            'start_date' => now()->addDay()->toDateString(),
            'end_date' => now()->toDateString(),  // Same or before start_date
            'duration_type' => 'full_day',
        ]);

        $response->assertStatus(422);
        expect($response->json('errors.end_date'))->toBeDefined();
    }

    public function test_store_leave_request_valid_request()
    {
        $employee = Employee::factory()->create();

        $response = $this->postJson('/api/leave-requests', [
            'employee_id' => $employee->id,
            'leave_type' => 'vacation',
            'start_date' => now()->addDay()->toDateString(),
            'end_date' => now()->addDays(3)->toDateString(),
            'duration_type' => 'full_day',
            'reason' => 'Family vacation',
        ]);

        $response->assertStatus(201);
    }
}
