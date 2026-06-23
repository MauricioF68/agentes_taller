<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\AgileController;
use App\Http\Controllers\AuditController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    // --- RUTAS DE NUESTRO DOMINIO: GRUPOS ---
    Route::get('/groups', [GroupController::class, 'index'])->name('groups.index'); 
    
    // --- RUTAS EXCLUSIVAS PARA DOCENTES ---
    Route::middleware(['role:docente'])->group(function () {
        Route::post('/cycles', [\App\Http\Controllers\AcademicCycleController::class, 'store'])->name('cycles.store');
        
        Route::post('/groups', [GroupController::class, 'store'])->name('groups.store');
        Route::patch('/groups/{group}/project', [GroupController::class, 'updateProjectName'])->name('groups.project.update');
        Route::post('/groups/evaluate', [\App\Http\Controllers\EvaluationController::class, 'evaluate'])->name('groups.evaluate');
        
        Route::get('/auditoria', [AuditController::class, 'index'])->name('audit.index');
        Route::post('/agent/chat', [\App\Http\Controllers\EvaluationController::class, 'chat'])->name('agent.chat');
    });

    // --- RUTAS EXCLUSIVAS PARA ALUMNOS ---
    Route::middleware(['role:alumno'])->group(function () {
        Route::post('/groups/join', [GroupController::class, 'join'])->name('groups.join');
        Route::post('/documents', [DocumentController::class, 'store'])->name('documents.store');
        
        // --- RUTAS ÁGILES (BACKLOG & DAILYS) + PROTECCIÓN DE GRUPO ---
        Route::middleware(['group.access'])->group(function () {
            Route::get('/groups/{group}/backlog', [AgileController::class, 'indexBacklog'])->name('agile.backlog');
            Route::post('/groups/{group}/backlog', [AgileController::class, 'storeBacklogItem'])->name('agile.backlog.store');
            Route::put('/groups/{group}/backlog/{item}', [AgileController::class, 'updateBacklogItem'])->name('agile.backlog.update');
            Route::delete('/groups/{group}/backlog/{item}', [AgileController::class, 'deleteBacklogItem'])->name('agile.backlog.delete');
            Route::patch('/groups/{group}/backlog/{item}/status', [AgileController::class, 'updateBacklogItemStatus'])->name('agile.backlog.status');
            Route::post('/groups/{group}/sprints', [AgileController::class, 'storeSprint'])->name('agile.sprints.store');
            
            Route::get('/groups/{group}/dailys', [AgileController::class, 'indexDailys'])->name('agile.dailys');
            Route::post('/groups/{group}/dailys', [AgileController::class, 'storeDaily'])->name('agile.dailys.store');
        });
    });
});

require __DIR__.'/auth.php';