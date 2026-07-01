<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use App\Models\PayrollPeriod;
use App\Models\Payslip;
use App\Models\AttendanceRecord;
use App\Models\LeaveRequest;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create employees
        $employees = Employee::factory(50)
            ->active()
            ->create();

        // Create some inactive employees
        Employee::factory(10)
            ->inactive()
            ->create();

        // Create payroll periods
        $payrollPeriods = PayrollPeriod::factory()
            ->count(3)
            ->create([
                'status' => 'open',
            ]);

        // Create payslips for each employee in each period
        foreach ($payrollPeriods as $period) {
            foreach ($employees->take(30) as $employee) {
                Payslip::factory()
                    ->create([
                        'employee_id' => $employee->id,
                        'payroll_period_id' => $period->id,
                        'status' => 'pending',
                    ]);
            }
        }

        // Create attendance records
        $startDate = now()->subDays(30);
        foreach ($employees as $employee) {
            for ($i = 0; $i < 20; $i++) {
                $date = $startDate->clone()->addDays($i);
                
                // Skip weekends
                if ($date->isWeekend()) {
                    continue;
                }

                AttendanceRecord::factory()
                    ->create([
                        'employee_id' => $employee->id,
                        'date' => $date,
                    ]);
            }
        }

        // Create leave requests
        foreach ($employees->take(15) as $employee) {
            LeaveRequest::factory()
                ->create([
                    'employee_id' => $employee->id,
                    'status' => 'pending',
                ]);
        }
    }
}

