<?php

namespace App\Domain\Agile\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Groups\Models\Group;
use App\Models\User;

class BacklogItem extends Model
{
    protected $fillable = [
        'group_id',
        'title',
        'description',
        'acceptance_criteria',
        'type',
        'status',
        'sprint_id',
        'assigned_to'
    ];

    public function sprint()
    {
        return $this->belongsTo(Sprint::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function dailys()
    {
        return $this->belongsToMany(Daily::class, 'daily_backlog_item')
                    ->withPivot('type')
                    ->withTimestamps();
    }
}
