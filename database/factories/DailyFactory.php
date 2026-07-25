<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DailyFactory extends Factory
{
    protected $model = \App\Domain\Agile\Models\Daily::class;

    public function definition(): array
    {
        return [

            'group_id' => \App\Domain\Groups\Models\Group::factory(),
            'user_id' => \App\Models\User::factory(),
            'what_i_did' => $this->faker->sentence(),
            'what_i_will_do' => $this->faker->sentence(),
            'blockers' => $this->faker->sentence(),
        
        ];
    }
}