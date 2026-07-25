<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class EvaluationFactory extends Factory
{
    protected $model = \App\Domain\Evaluations\Models\Evaluation::class;

    public function definition(): array
    {
        return [

            'group_id' => \App\Domain\Groups\Models\Group::factory(),
            'teacher_id' => \App\Models\User::factory(),
            'color' => $this->faker->randomElement(['green', 'yellow', 'red']),
            'feedback' => $this->faker->sentence(),
        
        ];
    }
}