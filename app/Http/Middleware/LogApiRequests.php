<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogApiRequests
{
    public function handle(Request $request, Closure $next)
    {
        // Log incoming request
        Log::channel('api')->info('API Request', [
            'method' => $request->getMethod(),
            'path' => $request->getPathInfo(),
            'ip' => $request->ip(),
            'user_id' => $request->user()?->id,
            'query' => $request->query(),
            'body' => $this->sanitizeBody($request),
        ]);

        $startTime = microtime(true);
        $response = $next($request);
        $duration = (microtime(true) - $startTime) * 1000; // Convert to ms

        // Log outgoing response
        Log::channel('api')->info('API Response', [
            'method' => $request->getMethod(),
            'path' => $request->getPathInfo(),
            'status' => $response->status(),
            'duration_ms' => round($duration, 2),
            'user_id' => $request->user()?->id,
        ]);

        return $response;
    }

    /**
     * Sanitize request body to remove sensitive information
     */
    private function sanitizeBody(Request $request): array
    {
        $body = $request->all();
        $sensitive = ['password', 'password_confirmation', 'token', 'secret', 'api_key'];

        foreach ($sensitive as $field) {
            if (isset($body[$field])) {
                $body[$field] = '***REDACTED***';
            }
        }

        return $body;
    }
}
