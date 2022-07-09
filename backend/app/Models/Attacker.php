<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin Builder
 */
class Attacker extends Model
{
    use HasFactory;

    protected $table = 'attackers';
    protected $primaryKey = 'attacker_id';
    protected $connection = 'secure';

    protected $fillable = [
        'attacker_id',
        'tracker',
        'name',
    ];

    public $incrementing = true;
}
