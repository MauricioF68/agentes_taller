<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;

class GroupE2ETest extends E2ETestCase
{
    /**
     * Prueba el flujo completo: el docente crea un ciclo, un grupo, y el alumno se une.
     */
    public function test_teacher_creates_group_and_student_joins(): void
    {
        $this->browse(function (Browser $teacher, Browser $student) {
            
            // 1. FLUJO DEL DOCENTE
            $teacher->loginAs($this->docente)
                    ->visit('/groups')
                    ->waitForText('Mis Grupos', 5)
                    ->pause(1500) // Pausa para visualización
                    
                    // Crear un Ciclo Académico
                    ->press('Nuevo Ciclo')
                    ->waitForText('Año', 5) // Esperar que el modal se abra
                    ->pause(1000)
                    ->type('year', '2026')
                    ->select('period', '1')
                    ->press('Crear Ciclo')
                    ->pause(1500)
                    
                    // Crear un Grupo
                    ->press('Nuevo Grupo')
                    ->waitForText('Crear Nuevo Grupo', 5)
                    ->pause(1000)
                    ->select('academic_cycle_id', '1') // Seleccionamos el ciclo creado antes
                    ->type('classroom', 'Aula Selenium')
                    ->type('project_name', 'Proyecto E2E')
                    ->select('shift', 'Día')
                    ->press('Crear Grupo')
                    ->pause(2000) // Pausa para ver la tabla actualizada
                    
                    // Validar que el grupo se muestra
                    ->assertSee('Aula Selenium')
                    ->assertSee('Proyecto E2E');


            // 2. FLUJO DEL ALUMNO
            $student->loginAs($this->alumno)
                    ->visit('/groups')
                    ->waitForText('Unirse a un Grupo', 5)
                    ->pause(1500)
                    
                    // El alumno selecciona el grupo creado (suponiendo ID 1 al refrescar BD)
                    ->select('group_id', '1')
                    ->pause(1000)
                    ->press('Unirme')
                    ->waitForText('Mi Grupo de Trabajo', 5)
                    ->pause(2000) // Pausa para ver la tabla del alumno
                    
                    // Validar que el alumno ve su proyecto
                    ->assertSee('Proyecto E2E')
                    ->assertSee('Aula Selenium');
        });
    }
}
