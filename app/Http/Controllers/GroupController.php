<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Domain\Groups\UseCases\CreateGroupUseCase;
use App\Domain\Groups\UseCases\JoinGroupUseCase;
use Exception;

class GroupController extends Controller
{
    /**
     * Almacena un nuevo grupo creado por un docente.
     */
    public function store(Request $request, CreateGroupUseCase $createGroupUseCase)
    {
        // Validación básica de entrada HTTP
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        try {
            // Ejecutamos el caso de uso inyectando el ID del usuario logueado
            $createGroupUseCase->execute($request->name, auth()->id());
            
            // Retornamos hacia la vista de React con un mensaje de éxito en la sesión
            return back()->with('success', 'Grupo creado exitosamente.');
        } catch (Exception $e) {
            // Si la regla de negocio falla, retornamos el error
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Asigna al alumno logueado a un grupo existente.
     */
    public function join(Request $request, JoinGroupUseCase $joinGroupUseCase)
    {
        // Validación básica de entrada HTTP
        $request->validate([
            'group_id' => 'required|exists:groups,id',
        ]);

        try {
            // Ejecutamos el caso de uso inyectando el ID del alumno logueado
            $joinGroupUseCase->execute($request->group_id, auth()->id());
            
            return back()->with('success', 'Te has unido al grupo de forma exitosa. Esta acción es irreversible.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}