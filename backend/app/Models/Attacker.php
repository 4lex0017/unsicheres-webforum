<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attacker extends Model
{
    use HasFactory;

    protected $table = 'attackers';
    protected $primaryKey = 'attacker_id';
    protected $connection = 'secure';

    protected $fillable = [
        'attacker_id',
        'ip_address',
        'name',
        'found_vulnerabilities'
    ];

    protected $casts = [
        'found_vulnerabilities' => 'array'
    ];

    public $incrementing = true;
}
