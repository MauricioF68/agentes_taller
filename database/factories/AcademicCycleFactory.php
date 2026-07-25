<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AcademicCycleFactory extends Factory
{
    protected $model = \App\Domain\Academic\Models\AcademicCycle::class;

    public function definition(): array
    {
        return [

            'year' => $this->faker->year(),
            'period' => $this->faker->numberBetween(1, 2),
            'teacher_id' => \App\Models\User::factory(),
        
        ];
    }
}