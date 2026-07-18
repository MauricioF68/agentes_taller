<?php

namespace Tests\Feature\Validations;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class AcademicCycleValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_academic_cycle_validates_required_fields()
    {
        $user = User::factory()->create(['role' => 'docente']);

        $response = $this->actingAs($user)->post('/cycles', []);
        
        $response->assertSessionHasErrors(['year', 'period']);
    }
}
