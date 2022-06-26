<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin Builder
 */
class ProfileComment extends Model
{
    use HasFactory;

    protected $table = 'profile_comments';
    protected $primaryKey = 'id';
    protected $connection = 'insecure';

    protected $fillable = [
        'id',
        'profile_id',
        'author',
        'content',
    ];

    public $incrementing = true;
}
