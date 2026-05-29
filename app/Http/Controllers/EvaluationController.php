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
            'score'    => 'required|numeric|min:0|max:20',
            'feedback' => 'nullable|string|max:1000'
        ]);

        try {
            $evaluateGroupUseCase->execute(
                $request->group_id,
                auth()->id(),
                $request->score,
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
            'category_slug' => 'required|string', // Se necesita el slug para ChromaDB (ej. 'project_charter')
            'message'  => 'required|string|max:500'
        ]);

        try {
            $iaResponse = $chatWithAgentUseCase->execute(
                auth()->id(),
                $request->group_id,
                $request->category_slug,
                $request->message
            );

            // A diferencia de otros controladores, aquí devolvemos JSON 
            // porque será un chat dinámico en React, no queremos recargar la página.
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