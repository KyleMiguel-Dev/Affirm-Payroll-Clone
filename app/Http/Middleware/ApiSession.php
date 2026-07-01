<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiSession
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // If there's a session cookie, load it
        if ($request->cookies->has(config('session.cookie'))) {
            $sessionId = $request->cookies->get(config('session.cookie'));
            // Start the session to load existing session data
        }

        return $next($request);
    }
}
