<?php

namespace Tests\Browser;

use App\Domain\Groups\Models\Group;
use App\Domain\Academic\Models\AcademicCycle;
use Laravel\Dusk\Browser;

class EvaluationE2ETest extends E2ETestCase
{
    /**
     * Prueba el flujo de evaluación de un grupo por parte del docente.
     */
    public function test_teacher_can_evaluate_group(): void
    {
        // 1. Preparar base de datos
        $cycle = AcademicCycle::factory()->create(['teacher_id' => $this->docente->id]);
        $group = Group::factory()->create(['academic_cycle_id' => $cycle->id, 'teacher_id' => $this->docente->id]);
        $group->students()->attach($this->alumno->id);

        $this->browse(function (Browser $teacher) use ($group) {
            
            $teacher->loginAs($this->docente)
                    ->visit('/groups')
                    ->waitForLocation('/groups', 5)
                    ->pause(1500)
                    
                    // Hacer clic en "Evaluar"
                    ->click('#btn-evaluar') // El botón Evaluar
                    ->pause(1000)
                    ->waitForText('Centro de Calificaciones', 5)
                    ->pause(1000)
                    
                    // Asumir que hay un botón de Enviar Evaluación en el modal
                    // Puede fallar si faltan campos requeridos en el form,
                    // por lo que intentamos llenar un textarea de feedback si existe
                    ->press('Óptimo')
                    ->pause(500)
                    ->type('feedback', 'Buen trabajo equipo, sigan así.')
                    ->pause(1000)
                    ->press('Aprobar y Guardar Nota')
                    ->pause(2000)
                    ->acceptDialog();
        });
    }
}
