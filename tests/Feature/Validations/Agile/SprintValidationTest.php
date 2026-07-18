<?php

namespace Tests\Feature\Validations\Agile;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class SprintValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_sprint_requires_name()
    {
        $user = User::factory()->create(['role' => 'alumno']);
        $teacher = User::factory()->create(['role' => 'docente']);
        $cycle = \App\Domain\Academic\Models\AcademicCycle::create([
            'year' => 2026,
            'period' => 1,
            'teacher_id' => $teacher->id
        ]);
        $group = \App\Domain\Groups\Models\Group::create([
            'name' => 'Test Group',
            'classroom' => 'A1',
            'shift' => 'Morning',
            'academic_cycle_id' => $cycle->id,
            'teacher_id' => $teacher->id
        ]);
        $user->groupsAsStudent()->attach($group->id);

        $response = $this->actingAs($user)->post("/groups/{$group->id}/sprints", []);
        // Should return validation errors for 'name'
        $response->assertSessionHasErrors(['name']);
    }
}
