<?php

namespace App\Providers;

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
        /**
         * Create databases.
         */
        if (!file_exists('/var/www/html/database/secure.sqlite')) {
            info('secure.sqlite created.');
            file_put_contents('/var/www/html/database/secure.sqlite', '');
        }

        if (!file_exists('/var/www/html/database/insecure.sqlite')) {
            info('insecure.sqlite created.');
            file_put_contents('/var/www/html/database/insecure.sqlite', '');
        }
    }
}
