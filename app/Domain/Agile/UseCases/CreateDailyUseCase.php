<?php

namespace App\Domain\Agile\UseCases;

use App\Domain\Agile\Models\Daily;
use App\Domain\Groups\Models\Group;
use Illuminate\Support\Facades\DB;
use Exception;

class CreateDailyUseCase
{
    public function execute(int $groupId, int $userId, array $data): Daily
    {
        $group = Group::find($groupId);

        if (!$group) {
            throw new Exception("El grupo no existe.");
        }

        DB::beginTransaction();
        try {
            $daily = Daily::create([
                'group_id' => $groupId,
                'user_id' => $userId,
                'date' => now()->toDateString(),
                'achievements_text' => $data['achievements_text'] ?? null,
                'plans_text' => $data['plans_text'] ?? null,
                'impediments' => $data['impediments'] ?? null,
            ]);

            // Asignar los backlog items de 'ayer'
            if (!empty($data['yesterday_items']) && is_array($data['yesterday_items'])) {
                foreach ($data['yesterday_items'] as $itemId) {
                    $daily->backlogItems()->attach($itemId, ['type' => 'yesterday']);
                }
            }

            // Asignar los backlog items de 'hoy'
            if (!empty($data['today_items']) && is_array($data['today_items'])) {
                foreach ($data['today_items'] as $itemId) {
                    $daily->backlogItems()->attach($itemId, ['type' => 'today']);
                }
            }

            DB::commit();
            return $daily;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
