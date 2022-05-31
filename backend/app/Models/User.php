<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

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
        'endorsements',
        'profile_picture',
        'profile_comments',
    ];

    protected $casts = [
        'groups' => 'array',
        'endorsements' => 'array',
        'profile_comments' => 'array'
    ];

    public $incrementing = true;
}
