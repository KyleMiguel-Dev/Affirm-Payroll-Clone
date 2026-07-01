<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\PayrollPeriod;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PayrollPeriod>
 */
class PayrollPeriodFactory extends Factory
{
    protected $model = PayrollPeriod::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-3 months');
        $endDate = (clone $startDate)->modify('+1 month');
        $paymentDate = (clone $endDate)->modify('+5 days');

        return [
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'payment_date' => $paymentDate->format('Y-m-d'),
            'frequency' => 'monthly',
            'status' => 'open',
            'notes' => $this->faker->sentence(),
        ];
    }

    public function locked(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'locked',
        ]);
    }

    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paid',
        ]);
    }
}
