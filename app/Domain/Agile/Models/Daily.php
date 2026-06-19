<?php

namespace App\Domain\Agile\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Groups\Models\Group;
use App\Models\User;

class Daily extends Model
{
    protected $table = 'dailys';

    protected $fillable = [
        'group_id',
        'user_id',
        'date',
        'achievements_text',
        'plans_text',
        'impediments'
    ];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function backlogItems()
    {
        return $this->belongsToMany(BacklogItem::class, 'daily_backlog_item')
                    ->withPivot('type')
                    ->withTimestamps();
    }
}
