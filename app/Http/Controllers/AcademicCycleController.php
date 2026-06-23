<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Domain\Academic\Models\AcademicCycle;

class AcademicCycleController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'year' => 'required|integer|min:2020|max:2100',
            'period' => 'required|integer|min:1|max:4',
        ]);

        $user = $request->user();

        if ($user->role !== 'docente') {
            return back()->with('error', 'No autorizado');
        }

        AcademicCycle::create([
            'year' => $request->year,
            'period' => $request->period,
            'teacher_id' => $user->id
        ]);

        return back()->with('success', 'Ciclo académico creado exitosamente.');
    }
}
