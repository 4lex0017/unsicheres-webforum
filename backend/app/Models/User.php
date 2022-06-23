<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Auth\User as Authenticable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @mixin Builder
 */
class User extends Authenticable
{
    use HasFactory, HasApiTokens;

    protected $table = 'users';
    protected $primaryKey = 'id';
    protected $connection = 'insecure';

    protected $fillable = [
        'id',
        'name',
        'password',
        'birth_date',
        'location',
        'about',
        'groups',
        'profile_picture',
        'profile_comments',
    ];

    protected $casts = [
        'groups' => 'array',
        'profile_comments' => 'array'
    ];

    public $incrementing = true;
}
