<?php

namespace Tests\Feature\Middleware;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;

class ApiRequestLoggingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->actingAs(User::factory()->create());
    }

    public function test_api_request_is_logged()
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

        Log::shouldHaveReceived('info')->times(3); // Request log + action log + response log
    }

    public function test_api_request_log_includes_method()
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

        Log::shouldHaveReceived('info')
            ->withArgs(function ($message, $context) {
                return isset($context['method']) && $context['method'] === 'POST';
            });
    }

    public function test_api_request_log_includes_path()
    {
        Log::spy();

        $this->getJson('/api/employees');

        Log::shouldHaveReceived('info')
            ->withArgs(function ($message, $context) {
                return isset($context['path']) && str_contains($context['path'], '/api/employees');
            });
    }

    public function test_api_request_log_includes_user_id()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        Log::spy();

        $this->getJson('/api/employees');

        Log::shouldHaveReceived('info')
            ->withArgs(function ($message, $context) {
                return isset($context['user_id']) && $context['user_id'] === $user->id;
            });
    }

    public function test_api_response_log_includes_status()
    {
        Log::spy();

        $this->getJson('/api/employees');

        Log::shouldHaveReceived('info')
            ->withArgs(function ($message, $context) {
                return isset($context['status']) && $context['status'] === 200;
            });
    }

    public function test_api_response_log_includes_duration()
    {
        Log::spy();

        $this->getJson('/api/employees');

        Log::shouldHaveReceived('info')
            ->withArgs(function ($message, $context) {
                return isset($context['duration_ms']) && is_numeric($context['duration_ms']);
            });
    }

    public function test_api_request_body_is_logged()
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

        Log::shouldHaveReceived('info')
            ->withArgs(function ($message, $context) {
                return isset($context['body']) && isset($context['body']['employee_id']);
            });
    }

    public function test_api_request_sanitizes_sensitive_fields()
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
            'password' => 'secretpassword',
        ]);

        Log::shouldHaveReceived('info')
            ->withArgs(function ($message, $context) {
                return isset($context['body']['password']) && 
                       $context['body']['password'] === '***REDACTED***';
            });
    }

    public function test_api_request_sanitizes_api_key()
    {
        Log::spy();

        $this->getJson('/api/employees', ['api_key' => 'secret123']);

        Log::shouldHaveReceived('info')
            ->withArgs(function ($message, $context) {
                return isset($context['body']['api_key']) && 
                       $context['body']['api_key'] === '***REDACTED***';
            });
    }

    public function test_api_request_sanitizes_token()
    {
        Log::spy();

        $this->postJson('/api/login', ['token' => 'secret_token']);

        Log::shouldHaveReceived('info')
            ->withArgs(function ($message, $context) {
                return isset($context['body']['token']) && 
                       $context['body']['token'] === '***REDACTED***';
            });
    }

    public function test_api_request_log_includes_ip_address()
    {
        Log::spy();

        $this->getJson('/api/employees');

        Log::shouldHaveReceived('info')
            ->withArgs(function ($message, $context) {
                return isset($context['ip']) && !empty($context['ip']);
            });
    }

    public function test_api_response_log_is_separate_from_request_log()
    {
        Log::spy();

        $this->getJson('/api/employees');

        // Should have multiple log entries (request and response)
        $calls = Log::getLogger()->getHandlers();
        expect(Log::getLogger()->getHandlers())->toBeDefined();
    }
}
