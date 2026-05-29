<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Domain\Groups\UseCases\CreateGroupUseCase;
use App\Domain\Groups\UseCases\JoinGroupUseCase;
use App\Domain\Groups\Models\Group;
use Exception;

class GroupController extends Controller
{
    /**
     * Almacena un nuevo grupo creado por un docente.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Si es Docente: Le enviamos los grupos que ha creado.
        if ($user->role === 'docente') {
            $groups = $user->groupsAsTeacher()->with('students')->get();
            return Inertia::render('Groups/TeacherGroups', [
                'groups' => $groups
            ]);
        }

        // Si es Alumno: Le enviamos su grupo actual y los disponibles para unirse.
        if ($user->role === 'alumno') {
            $myGroup = $user->groupsAsStudent()->first();
            $availableGroups = Group::with('teacher')->get(); 
            
            return Inertia::render('Groups/StudentGroups', [
                'myGroup' => $myGroup,
                'availableGroups' => $availableGroups
            ]);
        }

        return redirect()->route('dashboard');
    }


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