<?php

namespace App\Domain\Groups\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Domain\Documents\Models\Document;
use App\Domain\Evaluations\Models\Evaluation;

class Group extends Model
{
    protected $fillable = [
        'name', 
        'teacher_id'
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'group_user', 'group_id', 'user_id');
    }

    // Historial completo (No lo borramos)
    public function documents()
    {
        return $this->hasMany(Document::class, 'group_id');
    }

    // NUEVA RELACIÓN: Solo el documento más reciente por categoría
    public function latestDocuments()
    {
        return $this->hasMany(Document::class, 'group_id')
            ->whereIn('id', function ($query) {
                $query->selectRaw('MAX(id)')
                      ->from('documents')
                      ->groupBy('group_id', 'category_id');
            });
    }

    public function evaluation()
    {
        return $this->hasOne(Evaluation::class, 'group_id');
    }
}