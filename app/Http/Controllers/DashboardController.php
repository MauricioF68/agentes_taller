<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Domain\Groups\Models\Group;

class DashboardController extends Controller
{
    /**
     * Muestra el panel de control inyectando datos según el rol.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Vista para Docentes
        if ($user->role === 'docente') {
            $groups = $user->groupsAsTeacher()->with('students')->get();
            
            return Inertia::render('Dashboard', [
                'role' => 'docente',
                'teacherGroups' => $groups
            ]);
        }
        
        // Vista para Alumnos
        if ($user->role === 'alumno') {
            $myGroup = $user->groupsAsStudent()->with('documents')->first();
            $availableGroups = Group::with('teacher')->get(); 
            
            return Inertia::render('Dashboard', [
                'role' => 'alumno',
                'myGroup' => $myGroup,
                'availableGroups' => $availableGroups
            ]);
        }

        // Fallback genérico de seguridad
        return Inertia::render('Dashboard', ['role' => null]);
    }
}