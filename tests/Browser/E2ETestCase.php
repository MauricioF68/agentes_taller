<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTruncation;
use Tests\DuskTestCase;

abstract class E2ETestCase extends DuskTestCase
{
    use DatabaseTruncation;

    protected User $docente;
    protected User $alumno;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear los usuarios base solicitados por el usuario para todas las pruebas
        $this->docente = User::factory()->create([
            'name' => 'Profesor Prueba',
            'email' => 'prueba@docente.com',
            'password' => 'prueba123',
            'role' => 'docente',
        ]);

        $this->alumno = User::factory()->create([
            'name' => 'Alumno Prueba',
            'email' => 'prueba@alumno.com',
            'password' => 'prueba123',
            'role' => 'alumno',
        ]);
    }
}
