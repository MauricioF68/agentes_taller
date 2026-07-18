<?php

namespace Tests\Feature\Validations;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class GroupValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_group_validates_required_fields()
    {
        $user = User::factory()->create(['role' => 'docente']);
        $response = $this->actingAs($user)->post('/groups', []);
        
        $response->assertSessionHasErrors(['academic_cycle_id', 'classroom', 'shift']);
    }

    public function test_join_group_validates_group_id()
    {
        $user = User::factory()->create(['role' => 'alumno']);
        $response = $this->actingAs($user)->post('/groups/join', []);

        $response->assertSessionHasErrors(['group_id']);
    }
}
