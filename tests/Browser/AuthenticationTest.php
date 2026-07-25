<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class AuthenticationTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * Test a user can login.
     */
    public function test_user_can_login(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $this->browse(function (Browser $browser) use ($user) {
            $browser->visit('/login')
                    ->type('email', $user->email)
                    ->type('password', 'password')
                    ->press('button[type="submit"]')
                    ->waitForLocation('/dashboard')
                    ->assertPathIs('/dashboard') // Ajustar esto a la ruta real de tu dashboard
                    ->pause(2000); // Pausa de 2 segundos para grabar la pantalla
        });
    }

    /**
     * Test a user cannot login with invalid credentials.
     */
    public function test_user_cannot_login_with_invalid_password(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $this->browse(function (Browser $browser) use ($user) {
            $browser->visit('/login')
                    ->type('email', $user->email)
                    ->type('password', 'wrong-password')
                    ->press('button[type="submit"]')
                    ->waitForText('These credentials do not match our records.')
                    ->assertSee('These credentials do not match our records.')
                    ->pause(2000); // Pausa para ver la pantalla
        });
    }
}
