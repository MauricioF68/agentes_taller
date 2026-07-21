<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Domain\Groups\Models\Group;
use App\Domain\Agile\Models\MeetingMinute;

class MeetingMinuteController extends Controller
{
    /**
     * Display a listing of the minutes for a group.
     */
    public function index(Group $group)
    {
        $minutes = MeetingMinute::where('group_id', $group->id)->latest()->get();
        return Inertia::render('Agile/MeetingMinutes/Index', [
            'group' => $group,
            'minutes' => $minutes,
        ]);
    }

    /**
     * Upload and transcribe audio using Deepgram.
     */
    public function uploadAudio(\App\Http\Requests\UploadAudioMinuteRequest $request, Group $group)
    {

        $file = $request->file('audio');
        $audioContent = file_get_contents($file->getRealPath());

        $deepgramApiKey = env('DEEPGRAM_API_KEY');

        if (!$deepgramApiKey) {
            return response()->json(['error' => 'Deepgram API Key is missing'], 500);
        }

        try {
            // Call Deepgram API
            $response = Http::withHeaders([
                'Authorization' => 'Token ' . $deepgramApiKey,
                'Content-Type' => $file->getClientMimeType(),
            ])->withBody($audioContent, $file->getClientMimeType())
            ->post('https://api.deepgram.com/v1/listen?smart_format=true&language=es&model=nova-2');

            if ($response->successful()) {
                $data = $response->json();
                $transcription = trim($data['results']['channels'][0]['alternatives'][0]['transcript'] ?? '');

                if (empty($transcription)) {
                    return response()->json([
                        'error' => 'No se detectó voz en el audio. Asegúrate de hablar claro y que tu micrófono funcione.'
                    ], 400);
                }

                // Create initial minute record
                $minute = MeetingMinute::create([
                    'group_id' => $group->id,
                    'title' => 'Acta de Reunión - ' . now()->format('Y-m-d H:i'),
                    'transcription' => $transcription,
                    'status' => 'pending'
                ]);

                return response()->json([
                    'message' => 'Transcripción exitosa',
                    'minute' => $minute
                ]);
            }

            Log::error('Deepgram API Error', ['response' => $response->body()]);
            return response()->json(['error' => 'Failed to transcribe audio'], 500);

        } catch (\Exception $e) {
            Log::error('Audio processing error: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred during audio processing'], 500);
        }
    }

    /**
     * Use OpenAI to structure the raw transcription.
     */
    public function generateStructuredMinute(Request $request, Group $group, MeetingMinute $minute)
    {
        $geminiKey = env('GEMINI_API_KEY');
        if (!$geminiKey) {
            return response()->json(['error' => 'Gemini API Key is missing'], 500);
        }

        $transcription = $minute->transcription;
        if (empty($transcription)) {
            return response()->json(['error' => 'No transcription found to structure'], 400);
        }

        $prompt = "Eres un asistente experto en agilidad. A continuación tienes la transcripción cruda de una reunión de un equipo.\n"
                . "Tu tarea es generar un acta de acuerdos estructurada y profesional en estricto formato Markdown.\n"
                . "IMPORTANTE: Tu respuesta DEBE seguir EXACTAMENTE la siguiente estructura visual (incluyendo los emojis) adaptando el contenido a la transcripción:\n\n"
                . "🤝 Acuerdo de [Nombre del tema principal o consolidación]\n\n"
                . "**Fecha de Registro:** " . now()->format('d de F de Y') . "\n"
                . "**Proyecto:** [Nombre del proyecto o sistema inferido]\n"
                . "**Involucrados:**\n"
                . "- [Nombre del Evaluador/Docente/Scrum Master]\n"
                . "- [Nombre del Desarrollador/Alumno/Equipo]\n\n"
                . "🎯 1. Objetivo del Acuerdo\n"
                . "[Redacta el objetivo principal de la reunión, validaciones o rumbo técnico]\n\n"
                . "⚙️ 2. Alcance Técnico y Requerimientos\n"
                . "[Lista detallada de módulos, funcionalidades técnicas y herramientas acordadas (ej. APIs, cargas masivas)]\n\n"
                . "📝 3. Entregables Documentales y Pruebas\n"
                . "[Lista de entregables obligatorios, tipos de pruebas de software, e informes acordados]\n\n"
                . "📅 4. Acuerdos de Entrega y Evaluación\n"
                . "[Diagnóstico actual, ruta técnica, y fechas u horas límite de presentación acordadas]\n\n"
                . "✅ 5. Confirmación de Acuerdo\n"
                . "[ ] Leído y aprobado por el Docente/Evaluador.\n"
                . "[ ] Leído y aprobado por el Alumno/Desarrollador.\n\n"
                . "Transcripción:\n\"\"\"\n$transcription\n\"\"\"";

        $fullPrompt = "Eres un secretario experto en redactar actas de reuniones técnicas.\n" . $prompt;

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->timeout(60)->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $geminiKey, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $fullPrompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.5
                ]
            ]);

            if ($response->successful()) {
                $structuredText = $response->json()['candidates'][0]['content']['parts'][0]['text'];
                
                // Update the minute temporarily with the draft
                $minute->update([
                    'structured_minute' => $structuredText,
                    'status' => 'structured'
                ]);

                return response()->json([
                    'message' => 'Acta estructurada generada',
                    'structured_minute' => $structuredText,
                    'minute_id' => $minute->id
                ]);
            }

            $errorData = $response->json();
            $errorMessage = $errorData['error']['message'] ?? 'Error desconocido de Gemini';
            Log::error('Gemini API Error', ['response' => $response->body()]);
            return response()->json(['error' => 'Error de Gemini: ' . $errorMessage], 500);

        } catch (\Exception $e) {
            Log::error('Gemini processing error: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred during AI processing'], 500);
        }
    }

    /**
     * Save the final structured minute (can be edited by student).
     */
    public function saveStructuredMinute(\App\Http\Requests\SaveStructuredMinuteRequest $request, Group $group, MeetingMinute $minute)
    {

        $minute->update([
            'title' => $request->title,
            'structured_minute' => $request->structured_minute,
            'status' => 'completed'
        ]);

        return response()->json([
            'message' => 'Acta guardada correctamente.',
            'minute' => $minute
        ]);
    }

    /**
     * Use OpenAI to analyze the minute and current backlog, returning JSON suggestions.
     */
    public function generateBacklogSuggestions(Request $request, Group $group, MeetingMinute $minute)
    {
        $geminiKey = env('GEMINI_API_KEY');
        if (!$geminiKey) {
            return response()->json(['error' => 'Gemini API Key is missing'], 500);
        }

        $backlogItems = \App\Domain\Agile\Models\BacklogItem::where('group_id', $group->id)->get(['id', 'title', 'description', 'acceptance_criteria', 'type', 'status']);
        
        $prompt = "Eres un Product Owner experto. Revisa el Acta de la reunión y el Product Backlog actual.\n\n"
                . "Acta:\n\"\"\"" . $minute->structured_minute . "\"\"\"\n\n"
                . "Backlog Actual (JSON):\n" . $backlogItems->toJson() . "\n\n"
                . "Devuelve ÚNICAMENTE un JSON válido (sin formato markdown) con esta estructura exacta:\n"
                . "{\n"
                . "  \"new_items\": [{\"title\": \"...\", \"description\": \"...\", \"acceptance_criteria\": \"...\", \"type\": \"user_story\", \"story_points\": 1, \"due_date\": \"YYYY-MM-DD\"}],\n"
                . "  \"updated_items\": [{\"id\": 1, \"title\": \"...\", \"description\": \"...\", \"acceptance_criteria\": \"...\", \"type\": \"user_story\", \"story_points\": 3, \"due_date\": \"YYYY-MM-DD\", \"reason\": \"...\"}]\n"
                . "}\n"
                . "Si un campo como due_date no se especifica, devuélvelo como null. 'story_points' debe ser un número entero.\n"
                . "No incluyas explicaciones fuera del JSON. 'type' DEBE ser uno de los siguientes: user_story, spike, enabler, nfr, issue.";

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->timeout(60)->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $geminiKey, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.2,
                    'responseMimeType' => 'application/json'
                ]
            ]);

            if ($response->successful()) {
                $content = $response->json()['candidates'][0]['content']['parts'][0]['text'];
                return response()->json(json_decode($content, true));
            }

            $errorData = $response->json();
            $errorMessage = $errorData['error']['message'] ?? 'Error desconocido de Gemini';
            Log::error('Gemini API Error', ['response' => $response->body()]);
            return response()->json(['error' => 'Failed to generate backlog suggestions: ' . $errorMessage], 500);
        } catch (\Exception $e) {
            Log::error('Gemini Error: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred during AI processing'], 500);
        }
    }

    /**
     * Save the accepted backlog suggestions.
     */
    public function applyBacklogSuggestions(\App\Http\Requests\ApplyBacklogSuggestionsRequest $request, Group $group, MeetingMinute $minute)
    {

        $newItems = $request->input('new_items', []);
        $updatedItems = $request->input('updated_items', []);

        foreach ($newItems as $item) {
            \App\Domain\Agile\Models\BacklogItem::create([
                'group_id' => $group->id,
                'title' => $item['title'],
                'description' => $item['description'] ?? '',
                'acceptance_criteria' => $item['acceptance_criteria'] ?? '',
                'type' => $item['type'] ?? 'user_story',
                'story_points' => $item['story_points'] ?? 1,
                'due_date' => $item['due_date'] ?? null,
                'status' => 'backlog'
            ]);
        }

        foreach ($updatedItems as $item) {
            $dbItem = \App\Domain\Agile\Models\BacklogItem::where('group_id', $group->id)->find($item['id']);
            if ($dbItem) {
                $dbItem->update([
                    'title' => $item['title'],
                    'description' => $item['description'] ?? '',
                    'acceptance_criteria' => $item['acceptance_criteria'] ?? '',
                    'type' => $item['type'] ?? $dbItem->type,
                    'story_points' => $item['story_points'] ?? $dbItem->story_points,
                    'due_date' => $item['due_date'] ?? $dbItem->due_date
                ]);
            }
        }

        $minute->update(['status' => 'backlog_generated']);

        return response()->json([
            'message' => 'Backlog actualizado correctamente desde el acta.',
            'minute' => $minute
        ]);
    }
}
