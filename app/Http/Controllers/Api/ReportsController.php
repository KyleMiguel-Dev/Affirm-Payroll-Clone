<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use App\Models\Payslip;
use App\Models\Employee;
use App\Models\LeaveRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportsController extends Controller
{
    public function attendanceReport(Request $request): JsonResponse
    {
        try {
            $month = $request->query('month', date('m'));
            $year = $request->query('year', date('Y'));

            $attendance = AttendanceRecord::whereYear('date', $year)
                ->whereMonth('date', $month)
                ->selectRaw('DATE(date) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            $monthlyData = [];
            for ($i = 1; $i <= 31; $i++) {
                $date = date('Y-m-d', mktime(0, 0, 0, $month, $i, $year));
                if (date('m', strtotime($date)) != $month) break;
                
                $record = $attendance->firstWhere('date', $date);
                $monthlyData[] = [
                    'date' => $date,
                    'count' => $record->count ?? 0
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $monthlyData
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function payrollReport(Request $request): JsonResponse
    {
        try {
            $periods = $request->query('periods', 6);
            $payroll = Payslip::selectRaw('payroll_period_id, SUM(gross_salary) as total')
                ->groupBy('payroll_period_id')
                ->with('payrollPeriod')
                ->latest('payroll_period_id')
                ->limit($periods)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $payroll
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function employeesReport(Request $request): JsonResponse
    {
        try {
            $status = $request->query('status');
            $department = $request->query('department');

            $employees = Employee::when($status, fn($q) => $q->where('status', $status))
                ->when($department, fn($q) => $q->where('department', $department))
                ->get();

            return response()->json([
                'success' => true,
                'data' => $employees,
                'summary' => [
                    'total' => $employees->count(),
                    'by_department' => $employees->groupBy('department')->mapWithKeys(fn($group, $dept) => [$dept => $group->count()]),
                    'by_status' => $employees->groupBy('status')->mapWithKeys(fn($group, $status) => [$status => $group->count()]),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function export(Request $request): JsonResponse
    {
        try {
            $type = $request->input('type', 'attendance');
            
            // Placeholder for export logic
            return response()->json([
                'success' => true,
                'message' => 'Export functionality coming soon',
                'download_url' => '/exports/report.pdf'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
