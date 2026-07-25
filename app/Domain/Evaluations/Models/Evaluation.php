<?php

namespace App\Domain\Evaluations\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Domain\Groups\Models\Group;
use App\Models\User;

class Evaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id', 
        'teacher_id', 
        'score', 
        'color_status', 
        'feedback'
    ];

    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id');
    }

    public function evaluator()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}