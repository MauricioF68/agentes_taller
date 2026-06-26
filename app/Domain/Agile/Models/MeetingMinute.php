<?php

namespace App\Domain\Agile\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Groups\Models\Group;

class MeetingMinute extends Model
{
    protected $fillable = [
        'group_id',
        'title',
        'transcription',
        'structured_minute',
        'status',
    ];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
