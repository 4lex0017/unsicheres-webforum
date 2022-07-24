<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

class AccessToken extends SanctumPersonalAccessToken
{
    use HasFactory;

    protected $table = 'personal_access_tokens';
    protected $connection = 'secure';
}
