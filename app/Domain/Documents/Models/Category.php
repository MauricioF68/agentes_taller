<?php

namespace App\Domain\Documents\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name', 
        'slug', 
        'description'
    ];

    public function documents()
    {
        return $this->hasMany(Document::class, 'category_id');
    }
}