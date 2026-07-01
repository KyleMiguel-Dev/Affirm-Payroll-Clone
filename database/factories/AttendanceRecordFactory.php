<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\AttendanceRecord;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AttendanceRecord>
 */
class AttendanceRecordFactory extends Factory
{
    protected $model = AttendanceRecord::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $date = $this->faker->dateTimeBetween('-30 days');
        $checkInTime = (clone $date)->setTime($this->faker->numberBetween(8, 9), $this->faker->numberBetween(0, 59));
        $checkOutTime = (clone $checkInTime)->modify('+' . $this->faker->numberBetween(8, 10) . ' hours');
        
        $hoursWorked = ($checkOutTime->getTimestamp() - $checkInTime->getTimestamp()) / 3600;
        $overtimeHours = max(0, $hoursWorked - 8);

        return [
            'date' => $date,
            'check_in' => $checkInTime,
            'check_out' => $checkOutTime,
            'hours_worked' => round($hoursWorked, 2),
            'overtime_hours' => round($overtimeHours, 2),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}
