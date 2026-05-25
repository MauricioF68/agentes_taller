<?php

namespace App\Domain\Groups\UseCases;

use App\Models\User;
use App\Domain\Groups\Models\Group;
use Exception;

class JoinGroupUseCase
{
    /**
     * Asigna un alumno a un grupo aplicando las reglas de capacidad y exclusividad.
     *
     * @param int $groupId
     * @param int $studentId
     * @return void
     * @throws Exception
     */
    public function execute(int $groupId, int $studentId): void
    {
        $student = User::find($studentId);

        // Regla de Negocio: Solo alumnos pueden unirse a los grupos
        if (!$student || $student->role !== 'alumno') {
            throw new Exception("Operación denegada: El usuario no es un alumno válido.");
        }

        // Regla de Negocio: Acción irreversible, no puede tener más de un grupo
        if ($student->groupsAsStudent()->exists()) {
            throw new Exception("El alumno ya se encuentra asignado a un grupo. Esta acción es irreversible.");
        }

        $group = Group::findOrFail($groupId);

        // Regla de Negocio: Límite estricto de 5 integrantes por grupo
        if ($group->students()->count() >= 5) {
            throw new Exception("El grupo seleccionado ya ha alcanzado el límite máximo de 5 integrantes.");
        }

        // Asignación en tabla pivote (group_user)
        $group->students()->attach($studentId);
    }
}