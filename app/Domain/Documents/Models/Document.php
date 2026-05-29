<?php

namespace App\Domain\Documents\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Groups\Models\Group;
use App\Models\User;

class Document extends Model
{
    protected $fillable = [
        'group_id', 
        'category_id',
        'uploaded_by', 
        'original_name', 
        'file_path', 
        'status_ai'   
    ];

    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id');
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    // NUEVA RELACIÓN
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}