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

            return response()->json([
                'status' => 'success',
                'reply'  => $iaResponse
            ]);
            
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'reply'  => $e->getMessage()
            ], 500);
        }
    }
}