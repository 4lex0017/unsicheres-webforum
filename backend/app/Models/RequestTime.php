<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequestTime extends Model
{
    use HasFactory;

    protected $table = 'request_times';
    protected $primaryKey = 'request_id';
    protected $connection = 'secure';

    protected $fillable = [
        'request_id',
        'time',
    ];

    public $incrementing = true;
}
