<?php

namespace App\Providers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;

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
        $secure = DB::connection('secure')->getDatabaseName();
        $insecure = DB::connection('insecure')->getDatabaseName();

        if (!file_exists($secure)) {
            info('secure.sqlite created.');
            file_put_contents($secure, '');
        }

        if (!file_exists($insecure)) {
            info('insecure.sqlite created.');
            file_put_contents($insecure, '');
        }
    }
}
