<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SprintFactory extends Factory
{
    protected $model = \App\Domain\Agile\Models\Sprint::class;

    public function definition(): array
    {
        return [

            'group_id' => \App\Domain\Groups\Models\Group::factory(),
            'name' => 'Sprint ' . $this->faker->numberBetween(1, 10),
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->date(),
        
        ];
    }
}