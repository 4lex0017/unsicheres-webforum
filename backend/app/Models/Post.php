<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $table = 'posts';
    protected $primaryKey = 'post_id';
    protected $connection = 'insecure';

    protected $fillable = [
        'post_id',
        'poster_id',
        'edit_history',
        'vote_count',
        'post_title',
        'post_text',
        'relative_post_id'
    ];

    protected $casts = [
        'edit_history' => 'array'
    ];

    public $incrementing = true;
}
