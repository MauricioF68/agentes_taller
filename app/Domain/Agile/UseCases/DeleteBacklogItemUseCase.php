<?php

namespace App\Domain\Agile\UseCases;

use App\Domain\Agile\Models\BacklogItem;
use Exception;

class DeleteBacklogItemUseCase
{
    public function execute(int $itemId): void
    {
        $item = BacklogItem::find($itemId);

        if (!$item) {
            throw new Exception("El ítem no existe.");
        }

        $item->delete();
    }
}
