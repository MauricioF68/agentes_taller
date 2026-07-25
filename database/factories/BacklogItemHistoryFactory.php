<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class BacklogItemHistoryFactory extends Factory
{
    protected $model = \App\Models\BacklogItemHistory::class;

    public function definition(): array
    {
        return [

            'backlog_item_id' => \App\Domain\Agile\Models\BacklogItem::factory(),
            'user_id' => \App\Models\User::factory(),
            'action' => 'created',
            'old_value' => null,
            'new_value' => 'created',
        
        ];
    }
}