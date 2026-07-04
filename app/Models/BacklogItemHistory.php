<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BacklogItemHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'backlog_item_id',
        'user_id',
        'action',
        'old_value',
        'new_value',
    ];

    public function backlogItem()
    {
        return $this->belongsTo(\App\Domain\Agile\Models\BacklogItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
