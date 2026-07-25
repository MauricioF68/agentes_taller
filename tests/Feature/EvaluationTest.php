<?php

namespace Tests\Feature;

use App\Models\User;
use App\Domain\Groups\Models\Group;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EvaluationTest extends TestCase
{
    use RefreshDatabase;

    public function test_teacher_can_assign_evaluation(): void
    {
        $teacher = User::factory()->create(['role' => 'docente']);
        $group = Group::factory()->create();

        $response = $this->actingAs($teacher)->post('/groups/evaluate', [
            'group_id' => $group->id,
            'color_status' => 'verde',
            'feedback' => 'Good job on the sprint.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('evaluations', [
            'group_id' => $group->id,
            'teacher_id' => $teacher->id,
            'color_status' => 'verde',
            'feedback' => 'Good job on the sprint.',
        ]);
    }

    public function test_evaluation_validates_required_fields_and_colors(): void
    {
        $teacher = User::factory()->create(['role' => 'docente']);

        $response = $this->actingAs($teacher)->post('/groups/evaluate', [
            'group_id' => '', // Missing
            'color_status' => 'purple', // Invalid color
            'feedback' => '', // Missing
        ]);

        $response->assertSessionHasErrors(['group_id', 'color_status']);
    }
}
