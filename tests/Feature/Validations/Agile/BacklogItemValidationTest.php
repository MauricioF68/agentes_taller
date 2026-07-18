<?php

namespace Tests\Feature\Validations\Agile;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Domain\Groups\Models\Group;

class BacklogItemValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_backlog_item_requires_title()
    {
        $user = User::factory()->create(['role' => 'alumno']);
        $teacher = User::factory()->create(['role' => 'docente']);
        $cycle = \App\Domain\Academic\Models\AcademicCycle::create([
            'year' => 2026,
            'period' => 1,
            'teacher_id' => $teacher->id
        ]);
        $group = Group::create([
            'name' => 'Test Group',
            'classroom' => 'A1',
            'shift' => 'Morning',
            'academic_cycle_id' => $cycle->id,
            'teacher_id' => $teacher->id
        ]);
        $user->groupsAsStudent()->attach($group->id);

        $response = $this->actingAs($user)->post("/groups/{$group->id}/backlog", []);
        $response->assertSessionHasErrors(['title']);
    }
}
