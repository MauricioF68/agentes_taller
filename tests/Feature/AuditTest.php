<?php

namespace Tests\Feature;

use App\Models\User;
use App\Domain\Groups\Models\Group;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuditTest extends TestCase
{
    use RefreshDatabase;

    public function test_teacher_can_view_group_backlog(): void
    {
        $teacher = User::factory()->create(['role' => 'docente']);
        $group = Group::factory()->create();

        $response = $this->actingAs($teacher)->get("/groups/{$group->id}/teacher-backlog");

        $response->assertStatus(200);
    }

    public function test_teacher_can_view_tracking_history_with_filters(): void
    {
        $teacher = User::factory()->create(['role' => 'docente']);
        $group = Group::factory()->create();

        // Testing endpoint with query string for filters
        $response = $this->actingAs($teacher)->get("/groups/{$group->id}/teacher-tracking?start_date=2026-07-01&end_date=2026-07-31");

        $response->assertStatus(200);
    }

    public function test_teacher_can_view_general_audit_dashboard(): void
    {
        $teacher = User::factory()->create(['role' => 'docente']);

        $response = $this->actingAs($teacher)->get('/auditoria');

        $response->assertStatus(200);
    }
}
