<?php

namespace Tests\Feature\Middleware;

use Tests\TestCase;
use App\Exceptions\ApiException;
use App\Exceptions\BusinessLogicException;
use App\Exceptions\ResourceNotFoundException;
use App\Exceptions\UnauthorizedException;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;

class ApiErrorHandlerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->actingAs(User::factory()->create());
    }

    public function test_api_exception_returns_json_response()
    {
        // Register a test route that throws ApiException
        $this->app['router']->post('/test-api-exception', function () {
            throw new ApiException('Test error', 400);
        })->middleware('api');

        $response = $this->postJson('/test-api-exception');

        expect($response->status())->toBe(400);
        expect($response->json('status'))->toBe('error');
        expect($response->json('message'))->toBe('Test error');
        expect($response->json('timestamp'))->toBeDefined();
    }

    public function test_business_logic_exception_returns_422()
    {
        $this->app['router']->post('/test-business-logic', function () {
            throw new BusinessLogicException('Cannot perform operation');
        })->middleware('api');

        $response = $this->postJson('/test-business-logic');

        expect($response->status())->toBe(422);
        expect($response->json('message'))->toBe('Cannot perform operation');
    }

    public function test_resource_not_found_exception_returns_404()
    {
        $this->app['router']->post('/test-not-found', function () {
            throw new ResourceNotFoundException('Employee', '123');
        })->middleware('api');

        $response = $this->postJson('/test-not-found');

        expect($response->status())->toBe(404);
        expect($response->json('message'))->toContain('Employee not found');
    }

    public function test_unauthorized_exception_returns_403()
    {
        $this->app['router']->post('/test-unauthorized', function () {
            throw new UnauthorizedException('Access denied');
        })->middleware('api');

        $response = $this->postJson('/test-unauthorized');

        expect($response->status())->toBe(403);
        expect($response->json('message'))->toBe('Access denied');
    }

    public function test_validation_exception_returns_with_errors()
    {
        // Validation is already tested through form requests
        // This test verifies the middleware response format
        $response = $this->postJson('/api/employees', [
            'email' => 'invalid',
        ]);

        expect($response->status())->toBe(422);
        expect($response->json('status'))->toBe('error');
        expect($response->json('timestamp'))->toBeDefined();
    }

    public function test_exception_response_includes_iso8601_timestamp()
    {
        $this->app['router']->post('/test-timestamp', function () {
            throw new ApiException('Test');
        })->middleware('api');

        $response = $this->postJson('/test-timestamp');
        $timestamp = $response->json('timestamp');

        expect($timestamp)->toMatch('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.000Z$/');
    }

    public function test_exception_response_has_status_field()
    {
        $this->app['router']->post('/test-status', function () {
            throw new ApiException('Test');
        })->middleware('api');

        $response = $this->postJson('/test-status');

        expect($response->json('status'))->toBe('error');
    }

    public function test_exception_with_errors_array()
    {
        $errors = ['field1' => ['error1'], 'field2' => ['error2']];
        
        $this->app['router']->post('/test-errors', function () use ($errors) {
            throw new ApiException('Validation failed', 422, $errors);
        })->middleware('api');

        $response = $this->postJson('/test-errors');

        expect($response->json('errors'))->toBe($errors);
    }
}
