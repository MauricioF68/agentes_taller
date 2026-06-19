<?php

namespace App\Domain\Agile\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Domain\Groups\Models\Group;

class Sprint extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'name',
        'start_date',
        'end_date',
        'is_active',
    ];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function backlogItems()
    {
        return $this->hasMany(BacklogItem::class);
    }
}
