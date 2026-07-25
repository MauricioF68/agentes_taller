<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class MeetingMinuteFactory extends Factory
{
    protected $model = \App\Domain\Agile\Models\MeetingMinute::class;

    public function definition(): array
    {
        return [

            'group_id' => \App\Domain\Groups\Models\Group::factory(),
            'title' => 'Meeting ' . $this->faker->date(),
            'status' => 'pending',
            'transcription' => null,
            'structured_minute' => null,
        
        ];
    }
}