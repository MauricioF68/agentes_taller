<?php

namespace Tests\Feature\Validations;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class EvaluationValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_evaluate_group_validates_required_fields()
    {
        $user = User::factory()->create(['role' => 'docente']);
        $response = $this->actingAs($user)->post('/groups/evaluate', []);
        
        $response->assertSessionHasErrors(['group_id', 'color_status']);
    }
}
