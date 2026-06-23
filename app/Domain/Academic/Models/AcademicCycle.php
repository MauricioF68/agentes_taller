<?php

namespace App\Domain\Academic\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Domain\Groups\Models\Group;

class AcademicCycle extends Model
{
    use HasFactory;

    protected $fillable = [
        'year',
        'period',
        'teacher_id'
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function groups()
    {
        return $this->hasMany(Group::class, 'academic_cycle_id');
    }
}
