<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin Builder
 */
class Post extends Model
{
    use HasFactory;

    protected $table = 'posts';
    protected $primaryKey = 'id';
    protected $connection = 'insecure';

    protected $fillable = [
        'id',
        'thread_id',
        'author',
        'liked_from',
        'content'
    ];

    protected $casts = [
        'liked_from' => 'array'
    ];

    public $incrementing = true;
}
