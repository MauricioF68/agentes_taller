<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Domain\Groups\Models\Group;
use App\Domain\Agile\UseCases\CreateBacklogItemUseCase;
use App\Domain\Agile\UseCases\UpdateBacklogItemStatusUseCase;
use App\Domain\Agile\UseCases\UpdateBacklogItemUseCase;
use App\Domain\Agile\UseCases\DeleteBacklogItemUseCase;
use App\Domain\Agile\UseCases\CreateDailyUseCase;
use App\Domain\Agile\Models\BacklogItem;
use App\Domain\Agile\Models\Daily;
use Exception;

class AgileController extends Controller
{
    public function indexBacklog(Group $group)
    {
        // Traer ítems con sus asignados y su sprint
        $items = $group->backlogItems()->with(['assignee', 'sprint'])->get();
        $members = $group->students()->get();
        $sprints = $group->sprints()->orderBy('id', 'desc')->get();

        return Inertia::render('Agile/BacklogBoard', [
            'group' => $group,
            'items' => $items,
            'members' => $members,
            'sprints' => $sprints
        ]);
    }

    public function storeSprint(\App\Http\Requests\StoreSprintRequest $request, Group $group, \App\Domain\Agile\UseCases\CreateSprintUseCase $useCase)
    {

        try {
            $useCase->execute($group->id, $request->all());
            return back()->with('success', 'Sprint creado.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function storeBacklogItem(\App\Http\Requests\StoreBacklogItemRequest $request, Group $group, CreateBacklogItemUseCase $useCase)
    {

        try {
            $useCase->execute($group->id, $request->all());
            return back()->with('success', 'Item agregado al Backlog.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function updateBacklogItemStatus(\App\Http\Requests\UpdateBacklogItemStatusRequest $request, Group $group, $itemId, UpdateBacklogItemStatusUseCase $useCase)
    {

        try {
            $useCase->execute($itemId, $request->status);
            return back()->with('success', 'Estado actualizado.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function updateBacklogItem(\App\Http\Requests\UpdateBacklogItemRequest $request, Group $group, $itemId, UpdateBacklogItemUseCase $useCase)
    {

        try {
            $useCase->execute($itemId, $request->all());
            
            // Si el ítem fue editado (posiblemente corrigiendo un comentario), borramos los comentarios asociados
            \App\Models\BacklogItemComment::where('backlog_item_id', $itemId)->delete();
            
            return back()->with('success', 'Ítem corregido exitosamente.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function deleteBacklogItem(Group $group, $itemId, DeleteBacklogItemUseCase $useCase)
    {
        try {
            $useCase->execute($itemId);
            return back()->with('success', 'Ítem eliminado correctamente.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function indexDailys(Group $group)
    {
        $dailys = $group->dailys()->with(['user', 'backlogItems'])->orderBy('date', 'desc')->get();
        $activeItems = $group->backlogItems()->whereIn('status', ['assigned', 'in_progress'])->get();

        return Inertia::render('Agile/DailysList', [
            'group' => $group,
            'dailys' => $dailys,
            'activeItems' => $activeItems
        ]);
    }

    public function storeDaily(\App\Http\Requests\StoreDailyRequest $request, Group $group, CreateDailyUseCase $useCase)
    {

        try {
            $useCase->execute($group->id, auth()->id(), $request->all());
            return back()->with('success', 'Daily registrado exitosamente.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function teacherBacklog(Group $group)
    {
        // Traer ítems con asignados, comentarios e historial (tracking)
        $items = $group->backlogItems()
            ->with(['assignee', 'sprint', 'comments.user', 'histories.user'])
            ->get();
            
        $members = $group->students()->get();
        $sprints = $group->sprints()->orderBy('id', 'desc')->get();

        return Inertia::render('Agile/TeacherBacklogBoard', [
            'group' => $group,
            'items' => $items,
            'members' => $members,
            'sprints' => $sprints
        ]);
    }

    public function teacherTracking(Request $request, Group $group)
    {
        $endDate = $request->input('end_date') ? \Carbon\Carbon::parse($request->input('end_date'))->endOfDay() : \Carbon\Carbon::now()->endOfDay();
        $startDate = $request->input('start_date') ? \Carbon\Carbon::parse($request->input('start_date'))->startOfDay() : \Carbon\Carbon::now()->subDays(10)->startOfDay();

        // Get all tracking history for the group, ordered by latest, with date filters
        $histories = \App\Models\BacklogItemHistory::whereHas('backlogItem', function ($query) use ($group) {
            $query->where('group_id', $group->id);
        })
        ->whereBetween('created_at', [$startDate, $endDate])
        ->with(['user', 'backlogItem'])
        ->orderBy('created_at', 'desc')
        ->get();

        return Inertia::render('Agile/TeacherTracking', [
            'group' => $group,
            'histories' => $histories,
            'filters' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
                'is_default' => !$request->has('start_date') && !$request->has('end_date')
            ]
        ]);
    }
}
