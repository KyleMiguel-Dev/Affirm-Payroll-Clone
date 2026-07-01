<?php

namespace App\Http\Middleware;

use App\Exceptions\ApiException;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class ApiErrorHandler
{
    public function handle(Request $request, Closure $next)
    {
        try {
            return $next($request);
        } catch (ApiException $e) {
            return $e->render();
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
                'timestamp' => now()->toIso8601String(),
            ], 422);
        } catch (HttpException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage() ?: 'HTTP Error',
                'code' => $e->getStatusCode(),
                'timestamp' => now()->toIso8601String(),
            ], $e->getStatusCode());
        } catch (Throwable $e) {
            // Log the exception
            \Log::error('API Exception', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTrace(),
            ]);

            // Return generic error in production
            if (app()->isProduction()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'An internal server error occurred',
                    'timestamp' => now()->toIso8601String(),
                ], 500);
            }

            // Return detailed error in development
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTrace(),
                'timestamp' => now()->toIso8601String(),
            ], 500);
        }
    }
}
