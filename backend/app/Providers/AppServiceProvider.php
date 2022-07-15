<?php

namespace App\Providers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;
use App\Models\AccessToken;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $secure = './database/secure.sqlite';
        $insecure = './database/insecure.sqlite';

        if (!file_exists($secure)) {
            info('secure.sqlite created.');
            file_put_contents($secure, '');
        }

        if (!file_exists($insecure)) {
            info('insecure.sqlite created.');
            file_put_contents($insecure, '');
        }

        Sanctum::usePersonalAccessTokenModel(AccessToken::class);
    }
}
