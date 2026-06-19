<?php

namespace App\Domain\Agile\UseCases;

use App\Domain\Agile\Models\Sprint;
use App\Domain\Groups\Models\Group;
use Exception;

class CreateSprintUseCase
{
    public function execute(int $groupId, array $data): Sprint
    {
        $group = Group::find($groupId);

        if (!$group) {
            throw new Exception("El grupo no existe.");
        }

        $sprint = Sprint::create([
            'group_id' => $groupId,
            'name' => $data['name'],
            'start_date' => $data['start_date'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'is_active' => true,
        ]);

        return $sprint;
    }
}
