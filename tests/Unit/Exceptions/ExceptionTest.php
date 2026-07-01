<?php

namespace Tests\Unit\Exceptions;

use Tests\TestCase;
use App\Exceptions\ApiException;
use App\Exceptions\ResourceNotFoundException;
use App\Exceptions\ValidationException;
use App\Exceptions\UnauthorizedException;
use App\Exceptions\BusinessLogicException;
use Illuminate\Http\JsonResponse;

class ExceptionTest extends TestCase
{
    public function test_api_exception_renders_json_response()
    {
        $exception = new ApiException('Test error', 500);
        $response = $exception->render();

        expect($response)->toBeInstanceOf(JsonResponse::class);
        expect($response->getStatusCode())->toBe(500);
        
        $data = json_decode($response->getContent(), true);
        expect($data['status'])->toBe('error');
        expect($data['message'])->toBe('Test error');
        expect($data['timestamp'])->toBeDefined();
    }

    public function test_api_exception_with_errors_array()
    {
        $errors = ['email' => ['Invalid email']];
        $exception = new ApiException('Validation failed', 422, $errors);
        $response = $exception->render();

        $data = json_decode($response->getContent(), true);
        expect($data['errors'])->toBe($errors);
        expect($data['status'])->toBe('error');
    }

    public function test_api_exception_get_status_code()
    {
        $exception = new ApiException('Error', 403);
        expect($exception->getStatusCode())->toBe(403);
    }

    public function test_api_exception_get_errors()
    {
        $errors = ['field' => ['error message']];
        $exception = new ApiException('Error', 422, $errors);
        expect($exception->getErrors())->toBe($errors);
    }

    public function test_resource_not_found_exception()
    {
        $exception = new ResourceNotFoundException('Employee', '123');
        $response = $exception->render();

        expect($response->getStatusCode())->toBe(404);
        
        $data = json_decode($response->getContent(), true);
        expect($data['message'])->toContain('Employee not found');
        expect($data['message'])->toContain('123');
    }

    public function test_resource_not_found_without_identifier()
    {
        $exception = new ResourceNotFoundException('Resource');
        $response = $exception->render();

        $data = json_decode($response->getContent(), true);
        expect($data['message'])->toBe('Resource not found');
    }

    public function test_validation_exception()
    {
        $errors = ['email' => ['Invalid email']];
        $exception = new ValidationException($errors);
        $response = $exception->render();

        expect($response->getStatusCode())->toBe(422);
        
        $data = json_decode($response->getContent(), true);
        expect($data['status'])->toBe('error');
        expect($data['errors'])->toBe($errors);
    }

    public function test_validation_exception_with_custom_message()
    {
        $errors = ['email' => ['Invalid email']];
        $exception = new ValidationException($errors, 'Custom validation message');
        
        $data = json_decode($exception->render()->getContent(), true);
        expect($data['message'])->toBe('Custom validation message');
    }

    public function test_unauthorized_exception()
    {
        $exception = new UnauthorizedException();
        $response = $exception->render();

        expect($response->getStatusCode())->toBe(403);
        
        $data = json_decode($response->getContent(), true);
        expect($data['message'])->toBe('Unauthorized action');
    }

    public function test_unauthorized_exception_with_custom_message()
    {
        $exception = new UnauthorizedException('Cannot modify other user\'s data');
        
        $data = json_decode($exception->render()->getContent(), true);
        expect($data['message'])->toBe('Cannot modify other user\'s data');
    }

    public function test_business_logic_exception()
    {
        $exception = new BusinessLogicException('Payroll period is locked');
        $response = $exception->render();

        expect($response->getStatusCode())->toBe(422);
        
        $data = json_decode($response->getContent(), true);
        expect($data['message'])->toBe('Payroll period is locked');
    }

    public function test_business_logic_exception_with_custom_status()
    {
        $exception = new BusinessLogicException('Conflict detected', 409);
        $response = $exception->render();

        expect($response->getStatusCode())->toBe(409);
    }

    public function test_exception_response_has_iso8601_timestamp()
    {
        $exception = new ApiException('Test');
        
        $data = json_decode($exception->render()->getContent(), true);
        $timestamp = $data['timestamp'];
        
        // Validate ISO8601 format
        expect($timestamp)->toMatch('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.000Z$/');
    }

    public function test_exception_response_structure()
    {
        $exception = new ApiException('Test error', 400, ['field' => ['error']]);
        
        $data = json_decode($exception->render()->getContent(), true);
        
        expect($data)->toHaveKeys(['status', 'message', 'errors', 'timestamp']);
    }
}
