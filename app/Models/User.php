<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Domain\Groups\Models\Group;
use App\Domain\Documents\Models\Document;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // Añadido para el control de accesos (docente/alumno)
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // --- RELACIONES DEL DOMINIO ---

    public function groupsAsTeacher()
    {
        return $this->hasMany(Group::class, 'teacher_id');
    }

    public function groupsAsStudent()
    {
        return $this->belongsToMany(Group::class, 'group_user', 'user_id', 'group_id');
    }

    public function uploadedDocuments()
    {
        return $this->hasMany(Document::class, 'uploaded_by');
    }
}