<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\PayrollPeriod;
use App\Models\Payslip;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    public function list(Request $request): JsonResponse
    {
        try {
            $period = $request->query('period');
            $payslips = Payslip::with('employee', 'payrollPeriod')
                ->when($period, fn($q) => $q->whereHas('payrollPeriod', fn($sub) => $sub->where('id', $period)))
                ->paginate(20);

            return response()->json([
                'success' => true,
                'data' => $payslips
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function stats(): JsonResponse
    {
        try {
            $latestPeriod = PayrollPeriod::latest('start_date')->first();
            $totalPayroll = Payslip::sum('gross_salary') ?? 0;
            $totalDeductions = Payslip::sum('deductions') ?? 0;
            $totalNetPayroll = Payslip::sum('net_salary') ?? 0;

            return response()->json([
                'success' => true,
                'data' => [
                    'total_payroll' => number_format($totalPayroll, 2),
                    'total_deductions' => number_format($totalDeductions, 2),
                    'total_net_payroll' => number_format($totalNetPayroll, 2),
                    'latest_period' => $latestPeriod,
                    'payroll_count' => Payslip::count(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $payslip = Payslip::with('employee', 'payrollPeriod')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $payslip
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get real-time payroll summary
     * Lightweight endpoint for polling (every 30-60 seconds)
     */
    public function summary(): JsonResponse
    {
        try {
            $totalPayroll = Payslip::sum('gross_salary') ?? 0;
            $totalDeductions = Payslip::sum('total_deductions') ?? 0;
            $totalNetPayroll = $totalPayroll - $totalDeductions;
            $processedCount = Payslip::where('status', 'paid')->count();
            $pendingCount = Payslip::where('status', 'pending')->count();
            $approvedCount = Payslip::where('status', 'approved')->count();

            $latestPeriod = PayrollPeriod::latest('start_date')->first();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'total_payroll' => round($totalPayroll, 2),
                    'total_deductions' => round($totalDeductions, 2),
                    'total_net_payroll' => round($totalNetPayroll, 2),
                    'processed_count' => $processedCount,
                    'pending_count' => $pendingCount,
                    'approved_count' => $approvedCount,
                    'latest_period' => $latestPeriod ? [
                        'id' => $latestPeriod->id,
                        'name' => $latestPeriod->name,
                        'start_date' => $latestPeriod->start_date->format('M d, Y'),
                        'end_date' => $latestPeriod->end_date->format('M d, Y'),
                        'status' => $latestPeriod->status,
                    ] : null,
                    'timestamp' => now()->toIso8601String(),
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch payroll summary',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
