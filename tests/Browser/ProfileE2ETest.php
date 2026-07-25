<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;

class ProfileE2ETest extends E2ETestCase
{
    /**
     * Prueba el flujo de edición del perfil del usuario.
     */
    public function test_user_can_edit_profile(): void
    {
        $this->browse(function (Browser $browser) {
            
            $browser->loginAs($this->alumno)
                    ->visit('/profile')
                    ->waitForLocation('/profile', 5)
                    ->pause(1000)
                    
                    // Cambiar el nombre
                    ->type('#name', 'Nombre Editado por Dusk')
                    ->keys('#name', '{enter}') // Enviar formulario usando enter en el input
                    ->pause(1500)
                    
                    // Verificar que se guardó
                    ->assertSee('Saved.')
                    
                    // Verificar que el header muestra el nuevo nombre
                    ->assertSee('Nombre Editado por Dusk');
        });
    }
}
