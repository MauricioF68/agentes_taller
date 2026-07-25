<?php

namespace Tests\Browser;

use App\Domain\Groups\Models\Group;
use App\Domain\Academic\Models\AcademicCycle;
use App\Domain\Documents\Models\Category;
use App\Domain\Agile\Models\MeetingMinute;
use Laravel\Dusk\Browser;

class WorkspaceE2ETest extends E2ETestCase
{
    /**
     * Prueba subir documentos y visualizar el módulo de actas.
     */
    public function test_student_can_upload_document_and_view_minutes(): void
    {
        // Preparar base de datos para la prueba
        $cycle = AcademicCycle::factory()->create(['teacher_id' => $this->docente->id]);
        $group = Group::factory()->create(['academic_cycle_id' => $cycle->id, 'teacher_id' => $this->docente->id]);
        $group->students()->attach($this->alumno->id);
        
        // Crear categoría para que aparezca en el select de subida de documentos
        Category::factory()->create(['name' => 'Entregable Parcial']);

        // Insertar un acta ficticia en la BD para probar la vista
        $minute = MeetingMinute::create([
            'group_id' => $group->id,
            'title' => 'Reunión de Planificación',
            'transcription' => 'Transcripción de prueba.',
            'structured_minute' => 'Acta estructurada de prueba.',
            'status' => 'completed'
        ]);

        // Crear archivo falso para subir
        $filePath = __DIR__.'/dummy.pdf';
        file_put_contents($filePath, 'Fake PDF content');

        $this->browse(function (Browser $student) use ($group, $filePath, $minute) {
            
            // 1. FLUJO DEL ALUMNO SUBIENDO DOCUMENTO EN DASHBOARD
            $student->loginAs($this->alumno)
                    ->visit("/dashboard")
                    ->waitForText('Subir Archivo', 5)
                    ->pause(1000)
                    
                    // Adjuntar archivo en el input oculto o visible (Dusk soporta id)
                    ->attach('#file-input', $filePath)
                    ->pause(1000)
                    ->press('button[type="submit"]') // El botón de "Enviar a la Inteligencia Artificial"
                    ->pause(3000)
                    
                    // 2. FLUJO DE ACTAS DE REUNIÓN
                    ->visit("/groups/{$group->id}/minutes")
                    ->waitForLocation("/groups/{$group->id}/minutes", 5)
                    ->pause(1500)
                    
                    // Verificar que el acta insertada aparece en la lista
                    ->assertSee($minute->title)
                    ->assertSee('COMPLETED'); // Estado o similar
        });

        // Limpiar archivo falso
        @unlink($filePath);
    }
}
