<?php

namespace Tests\Browser;

use App\Domain\Groups\Models\Group;
use App\Domain\Academic\Models\AcademicCycle;
use Laravel\Dusk\Browser;

class AgileE2ETest extends E2ETestCase
{
    /**
     * Prueba los flujos ágiles: crear sprints, items del backlog y dailys.
     */
    public function test_student_can_manage_agile_board(): void
    {
        // Preparar base de datos para la prueba
        $cycle = AcademicCycle::factory()->create(['teacher_id' => $this->docente->id]);
        $group = Group::factory()->create(['academic_cycle_id' => $cycle->id, 'teacher_id' => $this->docente->id]);
        $group->students()->attach($this->alumno->id);

        $this->browse(function (Browser $student) use ($group) {
            
            // 1. FLUJO DEL ALUMNO EN BACKLOG
            $student->loginAs($this->alumno)
                    ->visit("/groups/{$group->id}/backlog")
                    ->waitForLocation("/groups/{$group->id}/backlog", 5)
                    ->pause(1500)
                    
                    // Crear un Sprint (Camino Feliz)
                    ->click('#btn-nuevo-sprint')
                    ->pause(1000)
                    ->type('name', 'Sprint 1 - MVP')
                    ->type('start_date', '01012026') 
                    ->type('end_date', '15012026')
                    ->press('button[type="submit"]') 
                    ->pause(1500)

                    // Crear una Tarea en el Backlog
                    ->click('#btn-nueva-tarea')
                    ->pause(1000)
                    ->type('title', 'Configurar Base de Datos')
                    ->type('description', 'Migraciones y seeders para la BD.')
                    ->select('story_points', '5')
                    ->press('button[type="submit"]') 
                    ->pause(1500)
                    
                    // Validar que la tarea aparece
                    ->assertSee('Configurar Base de Datos')

                    // Editar la Tarea (click en la tarea para abrir modal)
                    // Cambiar a vista de tabla para interactuar fácilmente
                    ->script("Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Tabla')).click();");
                    $student->pause(1000)
                    ->click('tbody tr') // Clic en la fila de la tabla para abrir el modal de edición
                    ->waitForText('Editar Ítem', 5)
                    ->pause(1000)
                    ->type('title', 'Configurar Base de Datos Editado')
                    ->click('button[type="submit"]') // Boton de guardar
                    ->pause(1500)
                    ->assertSee('Configurar Base de Datos Editado')

                    // Eliminar la Tarea
                    ->click('tbody tr')
                    ->waitForText('Editar Ítem', 5)
                    ->pause(1000)
                    ->click('button.text-red-600') // Asume el botón de eliminar (basurero rojo)
                    ->pause(1000)
                    ->acceptDialog() // Confirmar en el modal de alerta (si existe)
                    ->pause(1500)
                    ->assertDontSee('Configurar Base de Datos Editado')

                    // 2. FLUJO DE DAILYS
                    ->visit("/groups/{$group->id}/dailys")
                    ->waitForLocation("/groups/{$group->id}/dailys", 5)
                    ->pause(1500)
                    ->press('Registrar Daily') 
                    ->pause(1000)
                    ->type('achievements_text', 'Creación del backlog')
                    ->type('plans_text', 'Configuración de base de datos')
                    ->type('impediments', 'Ninguno por ahora')
                    ->press('button[type="submit"]')
                    ->pause(2000)
                    
                    ->assertSee('Creación del backlog');
        });
    }
}
