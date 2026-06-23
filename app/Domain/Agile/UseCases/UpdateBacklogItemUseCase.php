<?php

namespace App\Domain\Agile\UseCases;

use App\Domain\Agile\Models\BacklogItem;
use Exception;

class UpdateBacklogItemUseCase
{
    public function execute(int $itemId, array $data): BacklogItem
    {
        $item = BacklogItem::find($itemId);

        if (!$item) {
            throw new Exception("El ítem no existe.");
        }

        $item->update([
            'title' => $data['title'] ?? $item->title,
            'description' => $data['description'] ?? $item->description,
            'acceptance_criteria' => $data['acceptance_criteria'] ?? $item->acceptance_criteria,
            'type' => $data['type'] ?? $item->type,
            'status' => $data['status'] ?? $item->status,
            'story_points' => isset($data['story_points']) ? (int) $data['story_points'] : $item->story_points,
            'sprint_id' => $data['sprint_id'] ?? $item->sprint_id,
            'assigned_to' => $data['assigned_to'] ?? $item->assigned_to,
            'due_date' => array_key_exists('due_date', $data) ? $data['due_date'] : $item->due_date,
        ]);

        return $item;
    }
}
