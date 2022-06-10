<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';
    protected $primaryKey = 'id';
    protected $connection = 'insecure';

    protected $fillable = [
        'id',
        'title',
        'threads',
    ];

    protected $casts = [
        'threads' => 'array'
    ];

    public $incrementing = true;
}
