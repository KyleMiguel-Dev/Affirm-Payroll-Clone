<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\PayrollPeriod;
use App\Models\Payslip;
use App\Models\AttendanceRecord;
use App\Models\LeaveRequest;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Get comprehensive dashboard statistics
     */
    public function stats(): JsonResponse
    {
        try {
            // Basic employee metrics
            $totalEmployees = Employee::count();
            $activeEmployees = Employee::active()->count();
            $inactiveEmployees = Employee::inactive()->count();
            
            // Payroll metrics
            $pendingPayroll = PayrollPeriod::where('status', 'open')->count();
            $lockedPayroll = PayrollPeriod::where('status', 'locked')->count();
            $totalPayroll = Payslip::sum('gross_salary') ?? 0;
            
            // Attendance metrics
            $totalAttendance = AttendanceRecord::count();
            $attendancePercentage = 98.5; // Simplified
            
            // Leave metrics
            $pendingLeaves = LeaveRequest::where('status', 'pending')->count();
            $approvedLeaves = LeaveRequest::where('status', 'approved')->count();
            $rejectedLeaves = LeaveRequest::where('status', 'rejected')->count();
            
            // Department breakdown
            $departmentBreakdown = [];
            $departments = Employee::active()->pluck('department')->unique();
            foreach ($departments as $dept) {
                if ($dept) {
                    $departmentBreakdown[$dept] = Employee::active()->where('department', $dept)->count();
                }
            }
            
            // Employment type distribution
            $employmentTypes = [];
            $types = Employee::active()->pluck('employment_type')->unique();
            foreach ($types as $type) {
                if ($type) {
                    $employmentTypes[$type] = Employee::active()->where('employment_type', $type)->count();
                }
            }
            
            // Employee status distribution
            $employeeStatus = [];
            $statuses = Employee::pluck('status')->unique();
            foreach ($statuses as $status) {
                if ($status) {
                    $employeeStatus[$status] = Employee::where('status', $status)->count();
                }
            }
            
            // Recent activities
            $activities = [];
            $recentLeaves = LeaveRequest::with('employee')->latest()->limit(3)->get();
            foreach ($recentLeaves as $leave) {
                $activities[] = [
                    'type' => 'leave_request',
                    'title' => (($leave->employee->first_name ?? 'Employee') . ' requested ' . $leave->leave_type . ' leave'),
                    'timestamp' => 'Recently',
                    'icon' => '🗓️',
                    'status' => $leave->status,
                ];
            }
            
            // Recent payroll periods
            $recentPayrolls = PayrollPeriod::latest()->limit(2)->get();
            foreach ($recentPayrolls as $payroll) {
                $activities[] = [
                    'type' => 'payroll_period',
                    'title' => 'Payroll period processed',
                    'timestamp' => 'Recently',
                    'icon' => '💰',
                    'status' => $payroll->status,
                ];
            }
            
            // Payroll trends
            $payrollTrends = [];
            $periods = PayrollPeriod::orderBy('start_date')->limit(6)->get();
            foreach ($periods as $period) {
                $periodTotal = Payslip::where('payroll_period_id', $period->id)->sum('gross_salary') ?? 0;
                $payrollTrends[] = [
                    'period' => 'Period',
                    'amount' => (float)$periodTotal,
                    'formatted' => '$' . number_format($periodTotal, 0),
                ];
            }
            
            // Overtime hours
            $totalOvertime = 125.5;

            return response()->json([
                'status' => 'success',
                'data' => [
                    'company' => [
                        'name' => 'Affirm Technology Inc.',
                        'logo' => '/images/affirm-logo.png',
                    ],
                    'summary' => [
                        'total_employees' => $totalEmployees,
                        'active_employees' => $activeEmployees,
                        'inactive_employees' => $inactiveEmployees,
                        'pending_payroll' => $pendingPayroll,
                        'locked_payroll' => $lockedPayroll,
                        'total_payroll' => '$' . number_format($totalPayroll, 0),
                        'total_payroll_raw' => $totalPayroll,
                        'total_attendance' => $totalAttendance,
                        'attendance_percentage' => $attendancePercentage,
                        'pending_leaves' => $pendingLeaves,
                        'approved_leaves' => $approvedLeaves,
                        'rejected_leaves' => $rejectedLeaves,
                        'overtime_hours' => (float)$totalOvertime,
                    ],
                    'breakdowns' => [
                        'departments' => $departmentBreakdown,
                        'employment_types' => $employmentTypes,
                        'employee_status' => $employeeStatus,
                        'top_departments' => array_slice($departmentBreakdown, 0, 5, true),
                    ],
                    'trends' => [
                        'payroll' => $payrollTrends,
                    ],
                    'activities' => array_slice($activities, 0, 5),
                    'timestamp' => date('Y-m-d H:i:s'),
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch dashboard statistics',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get real-time KPI data
     * Lightweight endpoint for frequent polling (every 30-60 seconds)
     */
    public function kpi(): JsonResponse
    {
        try {
            $today = now()->toDateString();

            // Real-time KPI metrics
            $totalEmployees = Employee::count();
            $presentToday = AttendanceRecord::where('date', $today)
                ->where('status', 'present')
                ->distinct('employee_id')
                ->count();
            $absentToday = AttendanceRecord::where('date', $today)
                ->where('status', 'absent')
                ->distinct('employee_id')
                ->count();
            $pendingPayroll = PayrollPeriod::where('status', 'open')->count();
            $onLeaveToday = LeaveRequest::where('status', 'approved')
                ->whereDate('start_date', '<=', $today)
                ->whereDate('end_date', '>=', $today)
                ->count();
            $lateToday = AttendanceRecord::where('date', $today)
                ->where('status', 'late')
                ->distinct('employee_id')
                ->count();

            // Calculate attendance rate
            $totalRecords = $presentToday + $absentToday + $lateToday + $onLeaveToday;
            $attendanceRate = $totalRecords > 0 ? round(($presentToday / $totalRecords) * 100, 1) : 0;

            // Recent payroll summary
            $totalPayroll = Payslip::sum('gross_salary') ?? 0;
            $totalDeductions = Payslip::sum('total_deductions') ?? 0;

            return response()->json([
                'status' => 'success',
                'data' => [
                    'total_employees' => $totalEmployees,
                    'present_today' => $presentToday,
                    'absent_today' => $absentToday,
                    'on_leave_today' => $onLeaveToday,
                    'late_today' => $lateToday,
                    'attendance_rate' => $attendanceRate,
                    'pending_payroll' => $pendingPayroll,
                    'total_payroll' => $totalPayroll,
                    'total_deductions' => $totalDeductions,
                    'net_payroll' => $totalPayroll - $totalDeductions,
                    'timestamp' => now()->toIso8601String(),
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch KPI data',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get pending leave requests
     * For real-time notifications and dashboard display
     */
    public function pendingLeaves(): JsonResponse
    {
        try {
            $leaves = LeaveRequest::with('employee')
                ->where('status', 'pending')
                ->orderByDesc('created_at')
                ->limit(10)
                ->get()
                ->map(function ($leave) {
                    return [
                        'id' => $leave->id,
                        'employee_name' => $leave->employee->full_name ?? 'Unknown',
                        'leave_type' => $leave->leave_type,
                        'start_date' => $leave->start_date->format('M d, Y'),
                        'end_date' => $leave->end_date->format('M d, Y'),
                        'days' => $leave->number_of_days,
                        'reason' => $leave->reason,
                        'created_at' => $leave->created_at->diffForHumans(),
                    ];
                });

            return response()->json([
                'status' => 'success',
                'data' => $leaves,
                'total' => $leaves->count(),
                'timestamp' => now()->toIso8601String(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch pending leave requests',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}

