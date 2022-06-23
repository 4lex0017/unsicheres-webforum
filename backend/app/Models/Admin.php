<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticable;

class Admin extends Authenticable
{
    use HasFactory, HasApiTokens;

    protected $table = 'admins';
    protected $connection = 'secure';

    protected $fillable = [
        'id',
        'name',
        'password',
    ];
}
