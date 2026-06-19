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
    public function execute(int $groupId, int $teacherId, string $colorStatus, ?string $feedback): Evaluation
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

        // updateOrCreate permite que el profesor pueda actualizar la evaluación si se equivocó
        return Evaluation::updateOrCreate(
            ['group_id' => $groupId],
            [
                'teacher_id' => $teacherId,
                'score' => null, // Ya no usamos nota numérica
                'color_status' => $colorStatus,
                'feedback' => $feedback
            ]
        );
    }
}