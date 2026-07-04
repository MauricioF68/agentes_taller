<?php

namespace App\Observers;

use App\Domain\Agile\Models\BacklogItem;
use App\Models\BacklogItemHistory;

class BacklogItemObserver
{
    /**
     * Handle the BacklogItem "created" event.
     */
    public function created(BacklogItem $item): void
    {
        BacklogItemHistory::create([
            'backlog_item_id' => $item->id,
            'user_id' => auth()->id(),
            'action' => 'created',
            'old_value' => null,
            'new_value' => 'Ítem creado',
        ]);
    }

    /**
     * Handle the BacklogItem "updated" event.
     */
    public function updated(BacklogItem $item): void
    {
        $changes = $item->getDirty();

        if (array_key_exists('status', $changes)) {
            BacklogItemHistory::create([
                'backlog_item_id' => $item->id,
                'user_id' => auth()->id(),
                'action' => 'status_change',
                'old_value' => $item->getOriginal('status'),
                'new_value' => $item->status,
            ]);
        }

        if (array_key_exists('title', $changes) || array_key_exists('description', $changes) || array_key_exists('acceptance_criteria', $changes)) {
            BacklogItemHistory::create([
                'backlog_item_id' => $item->id,
                'user_id' => auth()->id(),
                'action' => 'updated_content',
                'old_value' => 'Contenido anterior modificado',
                'new_value' => 'Se editó el título, descripción o criterios',
            ]);
        }
    }

    /**
     * Handle the BacklogItem "deleted" event.
     */
    public function deleted(BacklogItem $item): void
    {
        // Opcionalmente registrar eliminación si es "soft delete", pero history hace on delete cascade.
    }
}
