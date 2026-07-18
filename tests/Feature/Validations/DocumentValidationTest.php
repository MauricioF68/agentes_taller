<?php

namespace Tests\Feature\Validations;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class DocumentValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_document_validates_required_fields()
    {
        $user = User::factory()->create(['role' => 'alumno']);
        $response = $this->actingAs($user)->post('/documents', []);
        
        $response->assertSessionHasErrors(['group_id', 'category_id', 'file']);
    }
}
