<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Thread extends Model
{
    use HasFactory;

    protected $table = 'threads';
    protected $primaryKey = 'thread_id';
    protected $connection = 'insecure';

    protected $fillable = [
        'thread_id',
        'poster_id',
        'thread_title',
        'tags',
        'thread_prefix',
        'posts'
    ];

    protected $casts = [
        'tags' => 'array',
        'posts' => 'array'
    ];

    public $incrementing = true;
}
