<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VoiceTranscriptionController extends Controller
{
    /**
     * Upload and transcribe short audio clips using Deepgram.
     * Returns plain text to be injected into textareas.
     */
    public function transcribe(Request $request)
    {
        $request->validate([
            'audio' => 'required|file|mimes:webm,mp3,wav,ogg,mp4',
        ]);

        $file = $request->file('audio');
        $audioContent = file_get_contents($file->getRealPath());

        $deepgramApiKey = env('DEEPGRAM_API_KEY');

        if (!$deepgramApiKey) {
            return response()->json(['error' => 'Deepgram API Key is missing'], 500);
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Token ' . $deepgramApiKey,
                'Content-Type' => $file->getClientMimeType(),
            ])->withBody($audioContent, $file->getClientMimeType())
            ->post('https://api.deepgram.com/v1/listen?smart_format=true&language=es&model=nova-2');

            if ($response->successful()) {
                $data = $response->json();
                $transcription = trim($data['results']['channels'][0]['alternatives'][0]['transcript'] ?? '');

                if (empty($transcription)) {
                    Log::warning('Deepgram transcription is empty for inline voice. Full response:', $data);
                    return response()->json([
                        'error' => 'No se detectó voz. Asegúrate de que el micrófono funcione.'
                    ], 400);
                }

                return response()->json([
                    'text' => $transcription
                ]);
            }

            Log::error('Deepgram API Error (Inline)', ['response' => $response->body()]);
            return response()->json(['error' => 'Error al procesar el audio con Deepgram'], 500);

        } catch (\Exception $e) {
            Log::error('Audio processing error (Inline): ' . $e->getMessage());
            return response()->json(['error' => 'Error de procesamiento de audio'], 500);
        }
    }
}
