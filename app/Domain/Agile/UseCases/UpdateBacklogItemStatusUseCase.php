<?php

namespace App\Domain\Agile\UseCases;

use App\Domain\Agile\Models\BacklogItem;
use Exception;

class UpdateBacklogItemStatusUseCase
{
    public function execute(int $itemId, string $status): BacklogItem
    {
        $item = BacklogItem::find($itemId);

        if (!$item) {
            throw new Exception("La tarea no existe.");
        }

        $validStatuses = ['backlog', 'assigned', 'in_progress', 'completed'];
        
        if (!in_array($status, $validStatuses)) {
            throw new Exception("Estado inválido.");
        }

        $item->status = $status;
        
        if ($status === 'completed') {
            $item->completed_at = now();
        } else {
            $item->completed_at = null;
        }
        
        $item->save();

        return $item;
    }
}
