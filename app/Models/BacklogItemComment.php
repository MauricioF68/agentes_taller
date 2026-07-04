<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BacklogItemComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'backlog_item_id',
        'user_id',
        'content',
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
