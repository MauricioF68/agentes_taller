<?php

namespace Tests\Feature\Validations;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Domain\Groups\Models\Group;
use Illuminate\Http\UploadedFile;

class MeetingMinuteValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_upload_audio_validates_audio_file()
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

        // Sending without audio
        $response = $this->actingAs($user)->post("/groups/{$group->id}/minutes/upload", []);
        $response->assertSessionHasErrors(['audio']);

        // Sending a text file instead of audio
        $file = UploadedFile::fake()->create('document.txt', 100, 'text/plain');
        $response = $this->actingAs($user)->post("/groups/{$group->id}/minutes/upload", [
            'audio' => $file,
        ]);
        $response->assertSessionHasErrors(['audio']); // Because it fails mimes:webm,mp3,wav,ogg,mp4
    }
}
