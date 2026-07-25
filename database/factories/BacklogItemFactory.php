<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class BacklogItemFactory extends Factory
{
    protected $model = \App\Domain\Agile\Models\BacklogItem::class;

    public function definition(): array
    {
        $baseDate = now();
        return [

            'group_id' => \App\Domain\Groups\Models\Group::factory(),
            'sprint_id' => null,
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'type' => $this->faker->randomElement(['story', 'task', 'bug']),
            'status' => 'backlog',
            'story_points' => $this->faker->numberBetween(1, 13),
            'due_date' => clone $baseDate,
            'assigned_to' => null,
        
        ];
    }
}