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
            $groups = $user->groupsAsTeacher()->with(['academicCycle', 'students', 'evaluation', 'latestDocuments', 'backlogItems', 'sprints'])->get();
            
            // TRUCO ARQUITECTÓNICO: Renombramos la relación al vuelo para no romper React y calculamos métricas ágiles
            $groups->each(function($group) {
                $group->setRelation('documents', $group->latestDocuments);
                $group->unsetRelation('latestDocuments');

                // Calcular métricas ágiles
                $backlogItems = $group->backlogItems;
                $totalPoints = $backlogItems->sum('story_points');
                $completedPoints = $backlogItems->where('status', 'completed')->sum('story_points');
                
                $group->agile_metrics = [
                    'total_points' => $totalPoints,
                    'completed_points' => $completedPoints,
                    'progress_percentage' => $totalPoints > 0 ? round(($completedPoints / $totalPoints) * 100) : 0,
                    'total_items' => $backlogItems->count(),
                    'completed_items' => $backlogItems->where('status', 'completed')->count(),
                    'in_progress_items' => $backlogItems->where('status', 'in_progress')->count(),
                    'issues_count' => $backlogItems->where('type', 'issue')->count(),
                    'active_sprints' => $group->sprints->where('is_active', true)->count()
                ];
            });
            
            return Inertia::render('Dashboard', [
                'role' => 'docente',
                'teacherGroups' => $groups,
                'categories' => $categories 
            ]);
        }
        
        // Vista para Alumnos
        if ($user->role === 'alumno') {
            $myGroup = $user->groupsAsStudent()->with(['latestDocuments', 'evaluation'])->first();
            
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