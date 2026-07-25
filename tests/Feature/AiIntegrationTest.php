<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AiIntegrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_chatbot_responds_to_general_query(): void
    {
        $teacher = User::factory()->create(['role' => 'docente']);

        Http::fake([
            '*search*' => Http::response([
                'respuesta' => 'This is a chatbot response.'
            ], 200)
        ]);

        $group = \App\Domain\Groups\Models\Group::factory()->create();

        $response = $this->actingAs($teacher)->post('/agent/chat', [
            'group_id' => $group->id,
            'message' => 'Hello AI',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('reply', 'This is a chatbot response.');
    }

    public function test_chatbot_triggers_metrics_when_keywords_used(): void
    {
        $teacher = User::factory()->create(['role' => 'docente']);

        $group = \App\Domain\Groups\Models\Group::factory()->create();

        Http::fake([
            '*search*' => Http::response([
                'respuesta' => 'Aquí tienes las métricas de avance.'
            ], 200)
        ]);

        $response = $this->actingAs($teacher)->post('/agent/chat', [
            'group_id' => $group->id,
            'message' => 'muéstrame las métricas de avance',
        ]);

        $response->assertStatus(200);
        // Ensure that the response type or content implies metrics were triggered
        // This asserts JSON structure based on standard API implementation.
        $this->assertArrayHasKey('metrics_data', $response->json());
        $this->assertTrue($response->json('has_metrics'));
    }

    public function test_inline_voice_to_text_transcription(): void
    {
        $user = User::factory()->create();

        Http::fake([
            'api.deepgram.com/v1/listen*' => Http::response([
                'results' => [
                    'channels' => [
                        [
                            'alternatives' => [
                                ['transcript' => 'Inline transcribed text']
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        $audioContent = hex2bin('1A45DFA30000000000000000');
        $audioFile = UploadedFile::fake()->createWithContent('voice.webm', $audioContent);

        $response = $this->actingAs($user)->withHeaders(['Accept' => 'application/json'])->post('/voice-to-text', [
            'audio' => $audioFile,
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('text', 'Inline transcribed text');
    }

    public function test_inline_voice_to_text_validates_audio(): void
    {
        $user = User::factory()->create();
        $textFile = UploadedFile::fake()->create('invalid.txt', 100, 'text/plain');

        $response = $this->actingAs($user)->withHeaders(['Accept' => 'application/json'])->post('/voice-to-text', [
            'audio' => $textFile,
        ]);

        $response->assertStatus(422); // Validation error JSON response usually 422
    }
}
