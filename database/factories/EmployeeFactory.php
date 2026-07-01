<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Employee;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => 'EMP-' . str_pad($this->faker->unique()->numberBetween(1000, 9999), 4, '0', STR_PAD_LEFT),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'hire_date' => $this->faker->dateTimeBetween('-5 years')->format('Y-m-d'),
            'employment_type' => $this->faker->randomElement(['full-time', 'part-time', 'contract']),
            'status' => $this->faker->randomElement(['active', 'inactive', 'on-leave']),
            'department' => $this->faker->randomElement(['Engineering', 'Sales', 'HR', 'Finance', 'Operations']),
            'position' => $this->faker->jobTitle(),
            'salary' => $this->faker->numberBetween(30000, 150000),
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inactive',
        ]);
    }
}
