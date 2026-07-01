<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Payslip;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payslip>
 */
class PayslipFactory extends Factory
{
    protected $model = Payslip::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $grossSalary = $this->faker->numberBetween(30000, 150000);
        $deductions = $grossSalary * 0.15; // 15% deductions
        $netSalary = $grossSalary - $deductions;

        return [
            'gross_salary' => $grossSalary,
            'deductions' => $deductions,
            'net_salary' => $netSalary,
            'status' => 'pending',
            'generated_at' => null,
            'paid_at' => null,
        ];
    }

    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paid',
            'paid_at' => now(),
        ]);
    }

    public function generated(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'generated',
            'generated_at' => now(),
        ]);
    }
}
