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
    public function evaluate(\App\Http\Requests\EvaluateGroupRequest $request, EvaluateGroupUseCase $evaluateGroupUseCase)
    {

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
    public function chat(\App\Http\Requests\ChatWithAgentRequest $request, ChatWithAgentUseCase $chatWithAgentUseCase)
    {

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

            $keywords = ['métrica', 'metrica', 'avance', 'progreso', 'estado', 'resumen', 'métricas', 'metricas', 'tracking', 'seguimiento', 'movimientos', 'actividad', 'tendencia', 'flujo', 'cuello de botella', 'volatilidad'];
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
                
                // --- Cálculo de Métricas (Función Helper interna) ---
                $calculateMetrics = function($filteredItems) {
                    $totalPoints = $filteredItems->sum('story_points');
                    if ($totalPoints == 0) $totalPoints = 1;
                    $completedPoints = $filteredItems->where('status', 'completed')->sum('story_points');
                    
                    $todo = $filteredItems->where('status', 'backlog')->count();
                    $inProgress = $filteredItems->whereIn('status', ['in_progress', 'assigned'])->count();
                    $completed = $filteredItems->where('status', 'completed')->count();

                    // Historias Vencidas y Entregas Tardías
                    $overdueAlerts = $filteredItems->filter(function($item) {
                        if (!$item->due_date) return false;
                        
                        $dueDate = \Carbon\Carbon::parse($item->due_date)->endOfDay();
                        
                        // Si está completado, verificar si fue entregado tarde
                        if ($item->status === 'completed' && $item->completed_at) {
                            return \Carbon\Carbon::parse($item->completed_at)->greaterThan($dueDate);
                        }
                        
                        // Si no está completado, verificar si ya se venció
                        return now()->greaterThan($dueDate);
                    })->map(function($item) {
                        $isCompletedLate = $item->status === 'completed';
                        return [
                            'item_id' => $item->id,
                            'title' => $item->title,
                            'type' => $isCompletedLate ? 'late_delivery' : 'overdue',
                            'message' => $isCompletedLate ? 'Entregado tarde' : 'Vencido'
                        ];
                    })->values()->toArray();

                    return [
                        'velocity' => [
                            'completed_points' => (int) $completedPoints,
                            'total_points' => (int) $filteredItems->sum('story_points'),
                            'percentage' => round(($completedPoints / $totalPoints) * 100)
                        ],
                        'status_distribution' => [
                            'todo' => $todo,
                            'in_progress' => $inProgress,
                            'completed' => $completed
                        ],
                        'overdue_alerts' => $overdueAlerts
                    ];
                };

                // Helper for Tracking Metrics
                $calculateTrackingMetrics = function($filteredHistories) {
                    $volatilityCount = $filteredHistories->filter(function($h) {
                        return in_array($h->action, ['title_change', 'description_change', 'acceptance_criteria_change']);
                    })->count();

                    $backwardsCount = 0;
                    $statusWeights = ['backlog' => 0, 'assigned' => 1, 'in_progress' => 2, 'completed' => 3];
                    foreach ($filteredHistories->where('action', 'status_change') as $h) {
                        $oldW = $statusWeights[$h->old_value] ?? -1;
                        $newW = $statusWeights[$h->new_value] ?? -1;
                        if ($oldW > -1 && $newW > -1 && $newW < $oldW) {
                            $backwardsCount++;
                        }
                    }

                    $timeline = $filteredHistories->groupBy(function($h) {
                        return $h->created_at->format('Y-m-d');
                    })->map(function($dayHistories, $date) {
                        return ['date' => $date, 'count' => $dayHistories->count()];
                    })->values()->sortBy('date')->toArray();

                    return [
                        'volatility_count' => $volatilityCount,
                        'backwards_count' => $backwardsCount,
                        'timeline' => $timeline
                    ];
                };

                // Base queries
                $items = $group->backlogItems;
                $histories = \App\Models\BacklogItemHistory::whereHas('backlogItem', function($q) use ($group) {
                    $q->where('group_id', $group->id);
                })->get();

                // Métricas Globales
                $globalMetrics = $calculateMetrics($items);
                $globalMetrics['tracking'] = $calculateTrackingMetrics($histories);

                // Métricas Semanales (ítems actualizados, creados o completados esta semana)
                $startOfWeek = now()->startOfWeek();
                $weeklyItems = $items->filter(function($item) use ($startOfWeek) {
                    return $item->updated_at >= $startOfWeek || 
                           ($item->completed_at && $item->completed_at >= $startOfWeek) ||
                           ($item->due_date && \Carbon\Carbon::parse($item->due_date) >= $startOfWeek);
                });
                
                $weeklyHistories = $histories->filter(function($h) use ($startOfWeek) {
                    return $h->created_at >= $startOfWeek;
                });

                $weeklyMetrics = $calculateMetrics($weeklyItems);
                $weeklyMetrics['tracking'] = $calculateTrackingMetrics($weeklyHistories);

                // Detectar si la intención primaria era esta semana
                $isWeeklyIntent = str_contains($msgLower, 'esta semana') || str_contains($msgLower, 'últimos días') || str_contains($msgLower, 'hoy');

                $metricsData = [
                    'default_view' => $isWeeklyIntent ? 'weekly' : 'global',
                    'global' => $globalMetrics,
                    'weekly' => $weeklyMetrics
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