<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\LeaveRequest;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LeaveRequest>
 */
class LeaveRequestFactory extends Factory
{
    protected $model = LeaveRequest::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('+1 week', '+2 months');
        $endDate = (clone $startDate)->modify('+' . $this->faker->numberBetween(1, 10) . ' days');

        return [
            'leave_type' => $this->faker->randomElement(['sick', 'vacation', 'personal', 'unpaid']),
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'duration_type' => $this->faker->randomElement(['full_day', 'half_day_morning', 'half_day_afternoon']),
            'status' => 'pending',
            'reason' => $this->faker->sentence(),
            'approved_by' => null,
            'rejection_reason' => null,
            'attachment_path' => null,
        ];
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'approved_by' => 1,
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'approved_by' => 1,
            'rejection_reason' => $this->faker->sentence(),
        ]);
    }
}
