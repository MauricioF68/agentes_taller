<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class BacklogItemCommentFactory extends Factory
{
    protected $model = \App\Models\BacklogItemComment::class;

    public function definition(): array
    {
        return [

            'backlog_item_id' => \App\Domain\Agile\Models\BacklogItem::factory(),
            'user_id' => \App\Models\User::factory(),
            'content' => $this->faker->sentence(),
        
        ];
    }
}