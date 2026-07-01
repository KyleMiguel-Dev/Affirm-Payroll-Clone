<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function list(Request $request): JsonResponse
    {
        try {
            $date = $request->query('date', date('Y-m-d'));
            $attendance = AttendanceRecord::with('employee')
                ->whereDate('date', $date)
                ->paginate(20);

            return response()->json([
                'success' => true,
                'data' => $attendance
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function stats(): JsonResponse
    {
        try {
            $today = date('Y-m-d');
            $present = AttendanceRecord::where('date', $today)
                ->where('check_in', '!=', null)
                ->count();
            $absent = Employee::active()->count() - $present;
            $late = AttendanceRecord::where('date', $today)
                ->where('check_in', '>', '09:00:00')
                ->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'present_today' => $present,
                    'absent_today' => $absent,
                    'late_arrivals' => $late,
                    'on_leave' => 5, // Simplified
                    'attendance_rate' => round(($present / (Employee::active()->count() ?: 1)) * 100, 1),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function filter(Request $request): JsonResponse
    {
        try {
            $query = AttendanceRecord::with('employee');

            if ($request->has('date')) {
                $query->whereDate('date', $request->query('date'));
            }

            if ($request->has('department')) {
                $query->whereHas('employee', fn($q) => $q->where('department', $request->query('department')));
            }

            $attendance = $query->paginate(20);

            return response()->json([
                'success' => true,
                'data' => $attendance
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get real-time attendance status
     * Lightweight endpoint for polling (every 30 seconds)
     */
    public function status(): JsonResponse
    {
        try {
            $today = date('Y-m-d');

            // Count distinct employees with attendance
            $present = AttendanceRecord::where('date', $today)
                ->where('status', 'present')
                ->distinct('employee_id')
                ->count();

            $absent = AttendanceRecord::where('date', $today)
                ->where('status', 'absent')
                ->distinct('employee_id')
                ->count();

            $late = AttendanceRecord::where('date', $today)
                ->where('status', 'late')
                ->distinct('employee_id')
                ->count();

            $onLeave = 0; // Can be fetched from LeaveRequest if needed
            $totalActive = Employee::active()->count();
            $totalExpected = $totalActive - $onLeave;
            $attendanceRate = $totalExpected > 0 ? round(($present / $totalExpected) * 100, 1) : 0;

            return response()->json([
                'status' => 'success',
                'data' => [
                    'present' => $present,
                    'absent' => $absent,
                    'late' => $late,
                    'on_leave' => $onLeave,
                    'attendance_rate' => $attendanceRate,
                    'date' => $today,
                    'timestamp' => now()->toIso8601String(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch attendance status',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
