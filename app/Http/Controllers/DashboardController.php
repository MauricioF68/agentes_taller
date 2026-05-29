<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Domain\Groups\Models\Group;
use App\Domain\Documents\Models\Category; 

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $categories = Category::all();
        
        // Vista para Docentes
        if ($user->role === 'docente') {
            // Cargamos 'latestDocuments' en lugar de 'documents'
            $groups = $user->groupsAsTeacher()->with(['students', 'evaluation', 'latestDocuments'])->get();
            
            // TRUCO ARQUITECTÓNICO: Renombramos la relación al vuelo para no romper React
            $groups->each(function($group) {
                $group->setRelation('documents', $group->latestDocuments);
                $group->unsetRelation('latestDocuments');
            });
            
            return Inertia::render('Dashboard', [
                'role' => 'docente',
                'teacherGroups' => $groups,
                'categories' => $categories 
            ]);
        }
        
        // Vista para Alumnos
        if ($user->role === 'alumno') {
            $myGroup = $user->groupsAsStudent()->with('latestDocuments')->first();
            
            if ($myGroup) {
                // Mismo truco para el grupo del alumno
                $myGroup->setRelation('documents', $myGroup->latestDocuments);
                $myGroup->unsetRelation('latestDocuments');
            }

            $availableGroups = Group::with('teacher')->get(); 
            
            return Inertia::render('Dashboard', [
                'role' => 'alumno',
                'myGroup' => $myGroup,
                'availableGroups' => $availableGroups,
                'categories' => $categories 
            ]);
        }

        return Inertia::render('Dashboard', ['role' => null]);
    }
}