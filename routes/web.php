<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    
    // Payroll Management
    Route::inertia('payroll', 'payroll/index')->name('payroll.index');
    
    // Attendance Management
    Route::inertia('attendance', 'attendance/index')->name('attendance.index');
    
    // Employee Management
    Route::inertia('employees', 'employees/index')->name('employees.index');
    
    // Reports & Analytics
    Route::inertia('reports', 'reports/index')->name('reports.index');
});

require __DIR__.'/settings.php';
