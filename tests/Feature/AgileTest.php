<?php

namespace Tests\Feature;

use App\Models\User;
use App\Domain\Groups\Models\Group;
use App\Domain\Agile\Models\Sprint;
use App\Domain\Agile\Models\BacklogItem;
use App\Models\BacklogItemComment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AgileTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_create_sprint(): void
    {
        $student = User::factory()->create(['role' => 'alumno']);
        $group = Group::factory()->create();
        $group->students()->attach($student); // Student joins group

        $response = $this->actingAs($student)->post("/groups/{$group->id}/sprints", [
            'name' => 'Sprint 1',
            'start_date' => '2026-07-01',
            'end_date' => '2026-07-15',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('sprints', [
            'group_id' => $group->id,
            'name' => 'Sprint 1',
        ]);
    }

    public function test_sprint_creation_requires_name(): void
    {
        $student = User::factory()->create(['role' => 'alumno']);
        $group = Group::factory()->create();
        $group->students()->attach($student);

        $response = $this->actingAs($student)->post("/groups/{$group->id}/sprints", [
            'name' => '',
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    public function test_student_can_create_backlog_item(): void
    {
        $student = User::factory()->create(['role' => 'alumno']);
        $group = Group::factory()->create();
        $group->students()->attach($student);

        $response = $this->actingAs($student)->post("/groups/{$group->id}/backlog", [
            'title' => 'As a user I want to login',
            'type' => 'story',
            'description' => 'Test description',
            'status' => 'To Do',
            'priority' => 'high',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('backlog_items', [
            'group_id' => $group->id,
            'title' => 'As a user I want to login',
        ]);
    }

    public function test_backlog_item_creation_requires_title(): void
    {
        $student = User::factory()->create(['role' => 'alumno']);
        $group = Group::factory()->create();
        $group->students()->attach($student);

        $response = $this->actingAs($student)->post("/groups/{$group->id}/backlog", [
            'title' => '',
        ]);

        $response->assertSessionHasErrors(['title']);
    }

    public function test_update_backlog_item_status_creates_history(): void
    {
        $student = User::factory()->create(['role' => 'alumno']);
        $group = Group::factory()->create();
        $group->students()->attach($student);
        $item = BacklogItem::factory()->create(['group_id' => $group->id, 'status' => 'To Do']);

        $response = $this->actingAs($student)->patch("/groups/{$group->id}/backlog/{$item->id}/status", [
            'status' => 'in_progress',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('backlog_items', [
            'id' => $item->id,
            'status' => 'in_progress',
        ]);
        // Depending on how tracking is implemented, either an event or direct DB insert occurs
        $this->assertDatabaseHas('backlog_item_histories', [
            'backlog_item_id' => $item->id,
            'action' => 'status_change',
        ]);
    }

    public function test_updating_backlog_item_details_deletes_teacher_comments(): void
    {
        $student = User::factory()->create(['role' => 'alumno']);
        $teacher = User::factory()->create(['role' => 'docente']);
        $group = Group::factory()->create();
        $group->students()->attach($student);
        
        $item = BacklogItem::factory()->create(['group_id' => $group->id, 'title' => 'Old Title']);
        $comment = BacklogItemComment::factory()->create(['backlog_item_id' => $item->id, 'user_id' => $teacher->id]);

        $response = $this->actingAs($student)->put("/groups/{$group->id}/backlog/{$item->id}", [
            'title' => 'New Title',
            'type' => 'story',
            'status' => 'To Do',
            'priority' => 'low',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('backlog_items', ['id' => $item->id, 'title' => 'New Title']);
        $this->assertDatabaseMissing('backlog_item_comments', ['id' => $comment->id]);
    }

    public function test_deleting_backlog_item_cascades(): void
    {
        $student = User::factory()->create(['role' => 'alumno']);
        $group = Group::factory()->create();
        $group->students()->attach($student);
        
        $item = BacklogItem::factory()->create(['group_id' => $group->id]);
        $comment = BacklogItemComment::factory()->create(['backlog_item_id' => $item->id]);

        $response = $this->actingAs($student)->delete("/groups/{$group->id}/backlog/{$item->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('backlog_items', ['id' => $item->id]);
        $this->assertDatabaseMissing('backlog_item_comments', ['id' => $comment->id]);
    }

    public function test_student_can_register_daily(): void
    {
        $student = User::factory()->create(['role' => 'alumno']);
        $group = Group::factory()->create();
        $group->students()->attach($student);

        $response = $this->actingAs($student)->post("/groups/{$group->id}/dailys", [
            'achievements_text' => 'Worked on auth',
            'plans_text' => 'Work on tests',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('dailys', [
            'group_id' => $group->id,
            'user_id' => $student->id,
            'achievements_text' => 'Worked on auth',
        ]);
    }

    public function test_daily_registration_requires_fields(): void
    {
        $student = User::factory()->create(['role' => 'alumno']);
        $group = Group::factory()->create();
        $group->students()->attach($student);

        $response = $this->actingAs($student)->post("/groups/{$group->id}/dailys", [
            'achievements_text' => '',
        ]);

        $response->assertSessionHasErrors(['achievements_text', 'plans_text']);
    }
}
