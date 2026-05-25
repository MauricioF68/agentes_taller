<?php

namespace App\Domain\Groups\UseCases;

use App\Models\User;
use App\Domain\Groups\Models\Group;
use Exception;

class CreateGroupUseCase
{
    /**
     * Ejecuta la creación de un nuevo grupo validando que el creador sea docente.
     *
     * @param string $name
     * @param int $teacherId
     * @return Group
     * @throws Exception
     */
    public function execute(string $name, int $teacherId): Group
    {
        $teacher = User::find($teacherId);

        // Regla de Negocio: Solo los docentes pueden crear grupos
        if (!$teacher || $teacher->role !== 'docente') {
            throw new Exception("Operación denegada: El usuario especificado no es un docente válido.");
        }

        return Group::create([
            'name' => $name,
            'teacher_id' => $teacherId
        ]);
    }
}