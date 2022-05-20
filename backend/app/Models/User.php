<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    protected $table = 'users';
    protected $primaryKey = 'user_id';
    protected $connection = 'insecure';

    protected $fillable = [
        'user_id',
        'password',
        'name',
        'score',
        'message_count',
        'profile_picture',
        'description',
        'birth_date',
        'location'
    ];

    public $incrementing = true;
}
