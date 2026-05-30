<?php

namespace App\Domain\Evaluations\UseCases;

use Illuminate\Support\Facades\Http;
use Exception;

class ChatWithAgentUseCase
{
    /**
     * Procesa el mensaje del docente interactuando con el motor RAG en Python.
     */
    public function execute(int $teacherId, int $groupId, string $categorySlug, string $message): string
    {
        // Limpiamos el mensaje para evaluar la palabra clave sin importar mayúsculas
        $cleanMessage = trim(strtolower($message));

        // Regla de Negocio: Palabra clave de activación
        if ($cleanMessage === 'auditar') {
            return "Hola profesor. Estoy conectado a ChromaDB y listo para analizar los documentos de este grupo. ¿Qué desea saber sobre los entregables?";
        }

        // --- SOLUCIÓN: Usar la variable de entorno ---
        $pythonBaseUrl = env('PYTHON_API_URL', 'http://127.0.0.1:8000');
        $pythonEndpoint = rtrim($pythonBaseUrl, '/') . '/search/';

        // Enviamos la pregunta al motor de IA en Python
        $response = Http::timeout(60)
            ->asForm()
            ->post($pythonEndpoint, [
                'pregunta' => $message,
                'group_id' => (string) $groupId,
                'category' => $categorySlug
            ]);

        if ($response->successful()) {
            $data = $response->json();
            return $data['respuesta'] ?? "No pude obtener una respuesta coherente del documento.";
        }

        // Manejo de errores de conexión
        throw new Exception("El motor de Inteligencia Artificial no está disponible en este momento. Intente de nuevo.");
    }
}