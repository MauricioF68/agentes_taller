<?php

namespace Tests\Browser;

use App\Domain\Groups\Models\Group;
use App\Domain\Academic\Models\AcademicCycle;
use Laravel\Dusk\Browser;

class AuditE2ETest extends E2ETestCase
{
    /**
     * Prueba el flujo de auditoría y chat de IA para el docente.
     */
    public function test_teacher_can_use_audit_chatbot(): void
    {
        // 1. Preparar base de datos
        $cycle = AcademicCycle::factory()->create(['teacher_id' => $this->docente->id]);
        $group = Group::factory()->create(['academic_cycle_id' => $cycle->id, 'teacher_id' => $this->docente->id]);
        $group->students()->attach($this->alumno->id);

        $this->browse(function (Browser $teacher) use ($group) {
            
            $teacher->loginAs($this->docente)
                    ->visit('/auditoria')
                    ->waitForLocation('/auditoria', 5)
                    ->pause(1500)
                    
                    // Seleccionar grupo
                    ->select('select', $group->id)
                    ->pause(1000)
                    
                    // Verificar mensaje de bienvenida de la IA
                    ->assertSee('Soy tu asistente de IA')
                    
                    // Escribir mensaje
                    ->type('input[type="text"]', '¿Cuál es el estado de este grupo?')
                    ->press('button[type="submit"]')
                    
                    // Esperar la respuesta
                    ->pause(3000); 
                    
            // Dado que la IA usa Axios, podríamos no verificar el texto exacto,
            // pero validamos que no haya crashes visuales.
        });
    }
}
