<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileComments extends Model
{
    use HasFactory;

    protected $table = 'profile_comments';
    protected $primaryKey = 'id';
    protected $connection = 'insecure';

    protected $fillable = [
        'id',
        'content',
        'author',
    ];

    public $incrementing = true;
}
