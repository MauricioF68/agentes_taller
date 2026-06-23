<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Domain\Documents\Models\Category;

class AuditController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'docente') {
            return redirect()->route('dashboard');
        }

        // Cargamos los grupos del docente
        $groups = $user->groupsAsTeacher()->with(['evaluation'])->get();
        $categories = Category::all();

        return Inertia::render('Auditoria/Index', [
            'groups' => $groups,
            'categories' => $categories
        ]);
    }
}
