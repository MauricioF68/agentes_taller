<?php

namespace App\Domain\Evaluations\UseCases;

use Illuminate\Support\Facades\Http;
use App\Domain\Groups\Models\Group;
use Exception;

class ChatWithAgentUseCase
{
    /**
     * Procesa el mensaje del docente interactuando con el motor RAG en Python.
     */
    public function execute(int $teacherId, int $groupId, ?string $categorySlug, string $message, array $history = []): string
    {
        $cleanMessage = trim(strtolower($message));

        if ($cleanMessage === 'auditar') {
            return "Hola profesor. Estoy conectado a la base de datos de Backlog y a los documentos. ¿Qué desea saber sobre el avance del equipo?";
        }

        $agileContext = $this->generateAgileContext($groupId);

        $pythonBaseUrl = env('PYTHON_API_URL', 'http://127.0.0.1:8000');
        $pythonEndpoint = rtrim($pythonBaseUrl, '/') . '/search/';

        // Enviamos el historial junto con la nueva pregunta
        $payload = [
            'pregunta' => $message,
            'group_id' => (string) $groupId,
            'category' => $categorySlug, // Puede ser null
            'agile_context' => $agileContext,
            'history' => $history
        ];

        $response = Http::timeout(60)
            ->asJson() // Usamos JSON para asegurar que el array history se envíe correctamente
            ->post($pythonEndpoint, $payload);

        if ($response->successful()) {
            $data = $response->json();
            return $data['respuesta'] ?? "No pude obtener una respuesta coherente.";
        }

        throw new Exception("El motor de Inteligencia Artificial no está disponible en este momento o falló. Intente de nuevo.");
    }

    private function generateAgileContext(int $groupId): string
    {
        $group = Group::with(['backlogItems', 'dailys' => function($query) {
            $query->orderBy('date', 'desc')->take(3);
        }])->find($groupId);

        if (!$group) return "No hay datos de grupo.";

        $items = $group->backlogItems;
        $totalItems = $items->count();
        $completed = $items->where('status', 'completed')->count();
        $inProgress = $items->where('status', 'in_progress')->count();
        
        $userStories = $items->where('type', 'user_story')->count();
        $spikes = $items->where('type', 'spike')->count();
        $enablers = $items->where('type', 'enabler')->count();
        $nfrs = $items->where('type', 'nfr')->count();
        $issues = $items->where('type', 'issue')->count();

        $context = "Métricas Exactas del Grupo '{$group->name}':\n";
        $context .= "Estado General:\n";
        $context .= "- Total de Items: {$totalItems}\n";
        $context .= "- Culminadas: {$completed}\n";
        $context .= "- En Proceso: {$inProgress}\n";
        
        $context .= "\nDesglose por Tipo (Importante para Scrum):\n";
        $context .= "- Historias de Usuario: {$userStories}\n";
        $context .= "- Spikes: {$spikes}\n";
        $context .= "- Habilitadores (Enablers): {$enablers}\n";
        $context .= "- Requisitos No Funcionales (NFR): {$nfrs}\n";
        $context .= "- Errores/Issues reportados: {$issues}\n\n";

        $context .= "Últimos reportes de Dailys (progreso diario):\n";
        foreach ($group->dailys as $daily) {
            $context .= "Fecha {$daily->date} - Logros: {$daily->achievements_text} | Impedimentos: {$daily->impediments}\n";
        }

        return $context;
    }
}