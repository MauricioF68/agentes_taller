<?php

namespace App\Domain\Agile\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Domain\Groups\Models\Group;
use App\Models\User;

class BacklogItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'title',
        'description',
        'acceptance_criteria',
        'type',
        'status',
        'story_points',
        'completed_at',
        'due_date',
        'sprint_id',
        'assigned_to'
    ];

    protected $casts = [
        'due_date' => 'date',
        'completed_at' => 'datetime'
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

    public function comments()
    {
        return $this->hasMany(\App\Models\BacklogItemComment::class)->latest();
    }

    public function histories()
    {
        return $this->hasMany(\App\Models\BacklogItemHistory::class)->latest();
    }
}
