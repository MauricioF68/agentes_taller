<?php

namespace App\Domain\Agile\UseCases;

use App\Domain\Agile\Models\BacklogItem;
use App\Domain\Groups\Models\Group;
use Exception;

class CreateBacklogItemUseCase
{
    public function execute(int $groupId, array $data): BacklogItem
    {
        $group = Group::find($groupId);

        if (!$group) {
            throw new Exception("El grupo no existe.");
        }

        // Se pueden agregar más validaciones de negocio aquí, 
        // como verificar si el usuario tiene permisos.

        $item = BacklogItem::create([
            'group_id' => $groupId,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'acceptance_criteria' => $data['acceptance_criteria'] ?? null,
            'type' => $data['type'] ?? 'user_story',
            'status' => $data['status'] ?? 'backlog',
            'story_points' => isset($data['story_points']) ? (int) $data['story_points'] : 1,
            'sprint_id' => $data['sprint_id'] ?? null,
            'assigned_to' => $data['assigned_to'] ?? null,
        ]);

        return $item;
    }
}
