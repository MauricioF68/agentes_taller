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
            $groups = $user->groupsAsTeacher()->with(['students', 'evaluation', 'academicCycle'])->get();
            $cycles = \App\Domain\Academic\Models\AcademicCycle::where('teacher_id', $user->id)->get();
            $categories = \App\Domain\Documents\Models\Category::all();

            return Inertia::render('Groups/TeacherGroups', [
                'groups' => $groups,
                'cycles' => $cycles,
                'categories' => $categories
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


    public function store(\App\Http\Requests\StoreGroupRequest $request, CreateGroupUseCase $createGroupUseCase)
    {
        // Validación básica de entrada HTTP

        try {
            // Generar un nombre automático si no lo envía (ej: G402 - Lunes)
            $data = $request->all();
            if (empty($data['name'])) {
                $data['name'] = $data['classroom'] . ' - ' . $data['shift'];
            }

            // Ejecutamos el caso de uso inyectando el ID del usuario logueado
            $createGroupUseCase->execute($data, auth()->id());
            
            // Retornamos hacia la vista de React con un mensaje de éxito en la sesión
            return back()->with('success', 'Grupo creado exitosamente.');
        } catch (Exception $e) {
            // Si la regla de negocio falla, retornamos el error
            return back()->with('error', $e->getMessage());
        }
    }

    public function updateProjectName(\App\Http\Requests\UpdateProjectNameRequest $request, Group $group)
    {

        // Authorization: Teacher or student belonging to the group
        $user = auth()->user();
        $isTeacher = $group->teacher_id === $user->id;
        $isStudent = $group->students()->where('users.id', $user->id)->exists();

        if (!$isTeacher && !$isStudent) {
            return back()->with('error', 'No tienes permiso para modificar este grupo.');
        }

        $group->update([
            'project_name' => $request->project_name
        ]);

        return back()->with('success', 'Nombre del proyecto actualizado.');
    }

    /**
     * Asigna al alumno logueado a un grupo existente.
     */
    public function join(\App\Http\Requests\JoinGroupRequest $request, JoinGroupUseCase $joinGroupUseCase)
    {
        // Validación básica de entrada HTTP

        try {
            // Ejecutamos el caso de uso inyectando el ID del alumno logueado
            $joinGroupUseCase->execute($request->group_id, auth()->id());
            
            return back()->with('success', 'Te has unido al grupo de forma exitosa. Esta acción es irreversible.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}