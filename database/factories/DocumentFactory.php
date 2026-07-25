<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DocumentFactory extends Factory
{
    protected $model = \App\Domain\Documents\Models\Document::class;

    public function definition(): array
    {
        return [

            'group_id' => \App\Domain\Groups\Models\Group::factory(),
            'user_id' => \App\Models\User::factory(),
            'category_id' => \App\Domain\Documents\Models\Category::factory(),
            'original_name' => $this->faker->word() . '.pdf',
            'file_path' => 'documents/' . $this->faker->uuid() . '.pdf',
        
        ];
    }
}