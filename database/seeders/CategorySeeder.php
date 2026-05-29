<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domain\Documents\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Project Charter',
                'slug' => 'project_charter',
                'description' => 'Documento de inicio y acta de constitución del proyecto.'
            ],
            [
                'name' => 'Presentación de Avances',
                'slug' => 'presentacion_avances',
                'description' => 'Diapositivas o reportes de avance periódico.'
            ],
            [
                'name' => 'Ceremonias y Acuerdos',
                'slug' => 'ceremonias_acuerdos',
                'description' => 'Actas de reunión, retrospectivas y planeación.'
            ]
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['slug' => $category['slug']], $category);
        }
    }
}