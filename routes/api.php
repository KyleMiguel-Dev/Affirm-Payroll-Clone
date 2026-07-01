<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PayrollController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\ReportsController;

// Public API routes (for clock sync)
Route::get('/server-time', function () {
    return response()->json([
        'timestamp' => now()->toIso8601String(),
        'timezone' => config('app.timezone'),
    ]);
});

// Authenticated API routes (Session-based auth for Inertia frontend)
Route::middleware(['auth'])->group(function () {
    // Dashboard stats
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/kpi', [DashboardController::class, 'kpi']);
    
    // Payroll endpoints
    Route::get('/payroll/list', [PayrollController::class, 'list']);
    Route::get('/payroll/stats', [PayrollController::class, 'stats']);
    Route::get('/payroll/summary', [PayrollController::class, 'summary']);
    Route::get('/payroll/{id}', [PayrollController::class, 'show']);
    
    // Attendance endpoints
    Route::get('/attendance/list', [AttendanceController::class, 'list']);
    Route::get('/attendance/stats', [AttendanceController::class, 'stats']);
    Route::get('/attendance/status', [AttendanceController::class, 'status']);
    Route::post('/attendance/filter', [AttendanceController::class, 'filter']);
    
    // Employee endpoints
    Route::get('/employees/list', [EmployeeController::class, 'list']);
    Route::get('/employees/search', [EmployeeController::class, 'search']);
    Route::get('/employees/{id}', [EmployeeController::class, 'show']);
    
    // Reports endpoints
    Route::get('/reports/attendance', [ReportsController::class, 'attendanceReport']);
    Route::get('/reports/payroll', [ReportsController::class, 'payrollReport']);
    Route::get('/reports/employees', [ReportsController::class, 'employeesReport']);
    Route::post('/reports/export', [ReportsController::class, 'export']);
    
    // Leave requests
    Route::get('/leave-requests/pending', [DashboardController::class, 'pendingLeaves']);
});
