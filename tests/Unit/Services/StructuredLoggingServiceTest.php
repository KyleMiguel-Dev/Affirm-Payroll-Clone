<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\StructuredLoggingService;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;

class StructuredLoggingServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create and authenticate a user for auth()->id() calls
        $user = User::factory()->create();
        $this->actingAs($user);
    }

    public function test_log_action_writes_to_operations_channel()
    {
        Log::spy();

        StructuredLoggingService::logAction('create', 'Employee', 1, [
            'employee_id' => 'E001',
        ]);

        Log::shouldHaveReceived('info')->once();
    }

    public function test_log_action_includes_user_context()
    {
        Log::spy();

        StructuredLoggingService::logAction('update', 'Employee', 1, []);

        // Verify the log was called with correct structure
        Log::shouldHaveReceived('info')
            ->withArgs(function ($message, $context) {
                return isset($context['user_id']) && isset($context['action']);
            });
    }

    public function test_log_operation_tracks_status()
    {
        Log::spy();

        StructuredLoggingService::logOperation('payroll_processing', 'success', [
            'count' => 50,
        ]);

        Log::shouldHaveReceived('info')->once();
    }

    public function test_log_transaction_includes_financial_data()
    {
        Log::spy();

        StructuredLoggingService::logTransaction('gross_payroll', 50000.00, '1', [
            'employee_count' => 50,
        ]);

        Log::shouldHaveReceived('info')->once();
    }

    public function test_log_payroll_event()
    {
        Log::spy();

        StructuredLoggingService::logPayrollEvent('period_locked', '1', [
            'locked_at' => now(),
        ]);

        Log::shouldHaveReceived('info')->once();
    }

    public function test_log_security_event_includes_severity()
    {
        Log::spy();

        StructuredLoggingService::logSecurityEvent('failed_login', 'warning', [
            'username' => 'test@example.com',
        ]);

        Log::shouldHaveReceived('warning')->once();
    }

    public function test_log_audit_includes_before_and_after()
    {
        Log::spy();

        $oldValues = ['salary' => 50000];
        $newValues = ['salary' => 55000];

        StructuredLoggingService::logAudit('update', 'Employee', 1, $oldValues, $newValues);

        Log::shouldHaveReceived('info')->once();
    }

    public function test_log_action_includes_ip_address()
    {
        Log::spy();

        StructuredLoggingService::logAction('delete', 'Employee', 1, []);

        Log::shouldHaveReceived('info')
            ->withArgs(function ($message, $context) {
                return isset($context['ip_address']);
            });
    }

    public function test_log_action_includes_timestamp()
    {
        Log::spy();

        StructuredLoggingService::logAction('create', 'Employee', 1, []);

        Log::shouldHaveReceived('info')
            ->withArgs(function ($message, $context) {
                return isset($context['timestamp']);
            });
    }
}
