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

    public function storeSprint(Request $request, Group $group, \App\Domain\Agile\UseCases\CreateSprintUseCase $useCase)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        try {
            $useCase->execute($group->id, $request->all());
            return back()->with('success', 'Sprint creado.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function storeBacklogItem(Request $request, Group $group, CreateBacklogItemUseCase $useCase)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'acceptance_criteria' => 'nullable|string',
            'type' => 'nullable|string',
            'status' => 'nullable|string',
            'story_points' => 'nullable|integer|min:1|max:5',
            'sprint' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
        ]);

        try {
            $useCase->execute($group->id, $request->all());
            return back()->with('success', 'Item agregado al Backlog.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function updateBacklogItemStatus(Request $request, Group $group, $itemId, UpdateBacklogItemStatusUseCase $useCase)
    {
        $request->validate([
            'status' => 'required|string',
        ]);

        try {
            $useCase->execute($itemId, $request->status);
            return back()->with('success', 'Estado actualizado.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function updateBacklogItem(Request $request, Group $group, $itemId, UpdateBacklogItemUseCase $useCase)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'acceptance_criteria' => 'nullable|string',
            'type' => 'nullable|string',
            'status' => 'nullable|string',
            'story_points' => 'nullable|integer|min:1|max:5',
            'sprint_id' => 'nullable|exists:sprints,id',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
        ]);

        try {
            $useCase->execute($itemId, $request->all());
            return back()->with('success', 'Ítem actualizado exitosamente.');
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

    public function storeDaily(Request $request, Group $group, CreateDailyUseCase $useCase)
    {
        $request->validate([
            'achievements_text' => 'required|string',
            'plans_text' => 'required|string',
            'impediments' => 'nullable|string',
            'yesterday_items' => 'nullable|array',
            'today_items' => 'nullable|array',
        ]);

        try {
            $useCase->execute($group->id, auth()->id(), $request->all());
            return back()->with('success', 'Daily registrado exitosamente.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
