<?php

namespace Tests\Feature;

use App\Models\User;
use App\Domain\Groups\Models\Group;
use App\Domain\Agile\Models\MeetingMinute;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class MeetingMinuteTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_view_meeting_minutes_list(): void
    {
        $student = User::factory()->create(['role' => 'alumno']);
        $group = Group::factory()->create();
        $group->students()->attach($student);

        $response = $this->actingAs($student)->get("/groups/{$group->id}/minutes");

        $response->assertStatus(200);
    }

    public function test_audio_upload_transcribes_via_deepgram(): void
    {
        $student = User::factory()->create(['role' => 'alumno']);
        $group = Group::factory()->create();
        $group->students()->attach($student);

        Http::fake([
            'api.deepgram.com/v1/listen*' => Http::response([
                'results' => [
                    'channels' => [
                        [
                            'alternatives' => [
                                ['transcript' => 'This is a mocked transcription.']
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        $audioFile = UploadedFile::fake()->create('meeting.mp3', 1000, 'audio/mpeg');

        $response = $this->actingAs($student)->post("/groups/{$group->id}/minutes/upload", [
            'audio' => $audioFile,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('meeting_minutes', [
            'group_id' => $group->id,
            'transcription' => 'This is a mocked transcription.',
        ]);
    }

    public function test_audio_upload_validates_format(): void
    {
        $student = User::factory()->create(['role' => 'alumno']);
        $group = Group::factory()->create();
        $group->students()->attach($student);

        $textFile = UploadedFile::fake()->create('document.txt', 100, 'text/plain');

        $response = $this->actingAs($student)->post("/groups/{$group->id}/minutes/upload", [
            'audio' => $textFile,
        ]);

        $response->assertSessionHasErrors(['audio']);
    }

    public function test_audio_upload_handles_no_voice_detected(): void
    {
        $student = User::factory()->create(['role' => 'alumno']);
        $group = Group::factory()->create();
        $group->students()->attach($student);

        Http::fake([
            'api.deepgram.com/v1/listen*' => Http::response([
                'results' => [
                    'channels' => [
                        [
                            'alternatives' => [
                                ['transcript' => '']
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        $audioFile = UploadedFile::fake()->create('silence.webm', 1000, 'audio/webm');

        $response = $this->actingAs($student)->postJson("/groups/{$group->id}/minutes/upload", [
            'audio' => $audioFile,
        ]);

        $response->assertStatus(422); // Validation error when requested with JSON
    }

    public function test_minute_generation_uses_gemini(): void
    {
        $student = User::factory()->create(['role' => 'alumno']);
        $group = Group::factory()->create();
        $group->students()->attach($student);
        $minute = MeetingMinute::factory()->create(['group_id' => $group->id, 'transcription' => 'Mock transcription']);

        Http::fake([
            '*generativelanguage.googleapis.com*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => '### Objetivo\n\nMocked Objective']
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        $response = $this->actingAs($student)->post("/groups/{$group->id}/minutes/{$minute->id}/generate");

        $response->assertStatus(200);
        $this->assertDatabaseHas('meeting_minutes', [
            'id' => $minute->id,
            'status' => 'structured',
        ]);
    }

    public function test_save_edited_structured_minute(): void
    {
        $student = User::factory()->create(['role' => 'alumno']);
        $group = Group::factory()->create();
        $group->students()->attach($student);
        $minute = MeetingMinute::factory()->create(['group_id' => $group->id]);

        $response = $this->actingAs($student)->putJson("/groups/{$group->id}/minutes/{$minute->id}/save", [
            'title' => 'Edited Title',
            'structured_minute' => '# Edited Content',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('meeting_minutes', [
            'id' => $minute->id,
            'structured_minute' => '# Edited Content',
        ]);
    }

    public function test_generate_backlog_suggestions(): void
    {
        $student = User::factory()->create(['role' => 'alumno']);
        $group = Group::factory()->create();
        $group->students()->attach($student);
        $minute = MeetingMinute::factory()->create(['group_id' => $group->id]);

        Http::fake([
            '*generativelanguage.googleapis.com*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => '[{"title": "Task 1", "description": "Desc"}]'] // Mock JSON array
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        $response = $this->actingAs($student)->post("/groups/{$group->id}/minutes/{$minute->id}/generate-backlog");

        $response->assertStatus(200); // Assuming it returns JSON suggestions for UI
    }

    public function test_apply_backlog_suggestions(): void
    {
        $student = User::factory()->create(['role' => 'alumno']);
        $group = Group::factory()->create();
        $group->students()->attach($student);
        $minute = MeetingMinute::factory()->create(['group_id' => $group->id, 'status' => 'structured', 'structured_minute' => '...']);

        $response = $this->actingAs($student)->postJson("/groups/{$group->id}/minutes/{$minute->id}/apply-backlog", [
            'new_items' => [
                ['title' => 'New AI Task', 'description' => 'Desc', 'type' => 'task']
            ]
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('backlog_items', [
            'group_id' => $group->id,
            'title' => 'New AI Task',
        ]);
    }
}
