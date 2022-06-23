<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin Builder
 */
class Thread extends Model
{
    use HasFactory;

    protected $table = 'threads';
    protected $primaryKey = 'id';
    protected $connection = 'insecure';

    protected $fillable = [
        'id',
        'category_id',
        'title',
        'liked_from',
        'author',
        'posts'
    ];

    protected $casts = [
        'liked_from' => 'array',
        'posts' => 'array'
    ];

    public $incrementing = true;
}
