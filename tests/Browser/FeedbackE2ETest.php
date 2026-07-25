<?php

namespace Tests\Browser;

use App\Domain\Groups\Models\Group;
use App\Domain\Academic\Models\AcademicCycle;
use App\Domain\Agile\Models\BacklogItem;
use Laravel\Dusk\Browser;

class FeedbackE2ETest extends E2ETestCase
{
    /**
     * Prueba el flujo de comentarios de feedback del docente al alumno.
     */
    public function test_teacher_can_comment_and_student_receives_notification(): void
    {
        // 1. Preparar base de datos
        $cycle = AcademicCycle::factory()->create(['teacher_id' => $this->docente->id]);
        $group = Group::factory()->create(['academic_cycle_id' => $cycle->id, 'teacher_id' => $this->docente->id]);
        $group->students()->attach($this->alumno->id);
        
        $item = BacklogItem::factory()->create([
            'group_id' => $group->id,
            'title' => 'Tarea de Prueba E2E'
        ]);

        $comentario = 'Este es un comentario automatizado de Dusk E2E.';

        // 2. Flujo del Docente (deja comentario)
        $this->browse(function (Browser $teacher, Browser $student) use ($group, $item, $comentario) {
            
            $teacher->loginAs($this->docente)
                    ->visit("/groups/{$group->id}/teacher-backlog")
                    ->waitForText($item->title, 5)
                    ->pause(1000)
                    ->click('.group') // Clickea el item del backlog
                    ->waitForText('Comentarios y Revisiones', 5)
                    ->pause(1000)
                    ->type('#comentario-textarea', $comentario)
                    ->click('button[type="submit"]') // Clic en "Enviar y Notificar"
                    ->pause(3000);

            // 3. Flujo del Alumno (recibe notificación)
            $student->loginAs($this->alumno)
                    ->visit('/dashboard')
                    ->waitForLocation('/dashboard', 5)
                    ->pause(1000)
                    ->click('a[title="Comentarios del Docente"]') 
                    ->waitForLocation('/my-comments', 5)
                    ->pause(1500)
                    ->assertSee($comentario)
                    ->assertSee($item->title);
        });
    }
}
