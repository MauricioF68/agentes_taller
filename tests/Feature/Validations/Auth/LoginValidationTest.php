<?php

namespace Tests\Feature\Validations\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_requires_email_and_password()
    {
        $response = $this->post('/login', []);
        $response->assertSessionHasErrors(['email', 'password']);
    }

    public function test_login_requires_valid_email()
    {
        $response = $this->post('/login', [
            'email' => 'not-an-email',
            'password' => 'password123'
        ]);
        $response->assertSessionHasErrors(['email']);
    }
}
