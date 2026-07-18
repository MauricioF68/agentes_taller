<?php

namespace Tests\Feature\Validations\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_requires_fields()
    {
        $response = $this->post('/register', []);
        $response->assertSessionHasErrors(['name', 'email', 'password']);
    }

    public function test_register_requires_password_confirmation()
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);
        // Since there is no password_confirmation, password will fail the 'confirmed' rule
        $response->assertSessionHasErrors(['password']);
    }
}
