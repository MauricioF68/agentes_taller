<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    protected $model = \App\Domain\Documents\Models\Category::class;

    public function definition(): array
    {
        return [

            'name' => $this->faker->word(),
            'slug' => $this->faker->slug(),
        
        ];
    }
}