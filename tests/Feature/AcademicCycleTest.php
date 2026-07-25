<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AcademicCycleTest extends TestCase
{
    use RefreshDatabase;

    public function test_teacher_can_create_academic_cycle(): void
    {
        $teacher = User::factory()->create(['role' => 'docente']);

        $response = $this->actingAs($teacher)->post('/cycles', [
            'year' => 2027,
            'period' => 1,
        ]);

        $response->assertRedirect(); // Assuming it redirects back or to index
        $this->assertDatabaseHas('academic_cycles', [
            'year' => 2027,
            'period' => 1,
            'teacher_id' => $teacher->id,
        ]);
    }

    public function test_academic_cycle_requires_year_and_period(): void
    {
        $teacher = User::factory()->create(['role' => 'docente']);

        $response = $this->actingAs($teacher)->post('/cycles', [
            'year' => '',
            'period' => '',
        ]);

        $response->assertSessionHasErrors(['year', 'period']);
    }

    public function test_student_cannot_create_academic_cycle(): void
    {
        $student = User::factory()->create(['role' => 'alumno']);

        $response = $this->actingAs($student)->post('/cycles', [
            'year' => 2027,
            'period' => 1,
        ]);

        $response->assertStatus(403); // Or redirect if middleware redirects
    }
}
