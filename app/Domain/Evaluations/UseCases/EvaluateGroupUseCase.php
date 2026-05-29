<?php

namespace App\Domain\Evaluations\UseCases;

use App\Models\User;
use App\Domain\Groups\Models\Group;
use App\Domain\Evaluations\Models\Evaluation;
use Exception;

class EvaluateGroupUseCase
{
    /**
     * Ejecuta la evaluación de un grupo y asigna el color correspondiente a la nota.
     */
    public function execute(int $groupId, int $teacherId, float $score, ?string $feedback): Evaluation
    {
        $teacher = User::find($teacherId);

        // Regla de Negocio: Solo los docentes pueden calificar
        if (!$teacher || $teacher->role !== 'docente') {
            throw new Exception("Operación denegada: Solo los docentes pueden evaluar a los grupos.");
        }

        $group = Group::find($groupId);
        if (!$group) {
            throw new Exception("El grupo especificado no existe.");
        }

        // Regla de Negocio: Asignación de colores (Semáforo de notas de 0 a 20)
        $colorStatus = 'red'; // Por defecto rojo (desaprobado crítico)
        
        if ($score >= 14) {
            $colorStatus = 'green'; // Aprobado / Excelente
        } elseif ($score >= 11) {
            $colorStatus = 'orange'; // En riesgo / Aprobado por la mínima
        }

        // updateOrCreate permite que el profesor pueda actualizar la nota si se equivocó
        return Evaluation::updateOrCreate(
            ['group_id' => $groupId],
            [
                'teacher_id' => $teacherId,
                'score' => $score,
                'color_status' => $colorStatus,
                'feedback' => $feedback
            ]
        );
    }
}