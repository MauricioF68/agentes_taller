<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Domain\Evaluations\UseCases\EvaluateGroupUseCase;
use App\Domain\Evaluations\UseCases\ChatWithAgentUseCase;
use Exception;

class EvaluationController extends Controller
{
    /**
     * Almacena o actualiza la calificación de un grupo.
     */
    public function evaluate(Request $request, EvaluateGroupUseCase $evaluateGroupUseCase)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'color_status' => 'required|string|in:calavera,enojado,rojo,naranja,amarillo,verde',
            'feedback' => 'nullable|string|max:1000'
        ]);

        try {
            $evaluateGroupUseCase->execute(
                $request->group_id,
                auth()->id(),
                $request->color_status,
                $request->feedback
            );

            return back()->with('success', 'Calificación guardada exitosamente.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Procesa la conversación del docente con el Agente de IA.
     */
    public function chat(Request $request, ChatWithAgentUseCase $chatWithAgentUseCase)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'category_slug' => 'nullable|string', 
            'message'  => 'required|string|max:1000',
            'history'  => 'nullable|array' // Historial de chat
        ]);

        try {
            $iaResponse = $chatWithAgentUseCase->execute(
                auth()->id(),
                $request->group_id,
                $request->category_slug,
                $request->message,
                $request->history ?? []
            );

            // Determinar si debemos incluir métricas visuales
            $group = \App\Domain\Groups\Models\Group::with('backlogItems')->find($request->group_id);
            $metricsData = null;
            $hasMetrics = false;

            $keywords = ['métrica', 'metrica', 'avance', 'progreso', 'estado', 'resumen', 'métricas', 'metricas'];
            $msgLower = strtolower($request->message);
            $responseLower = strtolower($iaResponse);

            $shouldShowMetrics = false;
            foreach ($keywords as $kw) {
                if (str_contains($msgLower, $kw) || str_contains($responseLower, $kw)) {
                    $shouldShowMetrics = true;
                    break;
                }
            }

            if ($shouldShowMetrics && $group) {
                $items = $group->backlogItems;
                $totalPoints = $items->sum('story_points');
                if ($totalPoints == 0) $totalPoints = 1; // avoid division by zero
                $completedPoints = $items->where('status', 'completed')->sum('story_points');
                
                $todo = $items->where('status', 'backlog')->count();
                $inProgress = $items->whereIn('status', ['in_progress', 'assigned'])->count();
                $completed = $items->where('status', 'completed')->count();

                $sevenDaysAgo = now()->subDays(7);
                $inactivityAlerts = $items->whereIn('status', ['backlog', 'assigned', 'in_progress'])
                    ->filter(function($item) use ($sevenDaysAgo) {
                        return $item->updated_at < $sevenDaysAgo;
                    })->map(function($item) {
                        return [
                            'item_id' => $item->id,
                            'title' => $item->title,
                            'days_stuck' => (int) $item->updated_at->diffInDays(now())
                        ];
                    })->values()->toArray();

                $metricsData = [
                    'velocity' => [
                        'completed_points' => (int) $completedPoints,
                        'total_points' => (int) $items->sum('story_points'),
                        'percentage' => round(($completedPoints / $totalPoints) * 100)
                    ],
                    'status_distribution' => [
                        'todo' => $todo,
                        'in_progress' => $inProgress,
                        'completed' => $completed
                    ],
                    'inactivity_alerts' => $inactivityAlerts
                ];
                $hasMetrics = true;
            }

            return response()->json([
                'status' => 'success',
                'reply'  => $iaResponse,
                'has_metrics' => $hasMetrics,
                'metrics_data' => $metricsData
            ]);
            
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'reply'  => $e->getMessage()
            ], 500);
        }
    }
}