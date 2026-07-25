<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class GroupFactory extends Factory
{
    protected $model = \App\Domain\Groups\Models\Group::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'academic_cycle_id' => \App\Domain\Academic\Models\AcademicCycle::factory(),
            'teacher_id' => \App\Models\User::factory(),
            'classroom' => $this->faker->word(),
            'shift' => $this->faker->randomElement(['Mañana', 'Tarde', 'Noche']),
            'project_name' => $this->faker->sentence(3),
        
        ];
    }
}