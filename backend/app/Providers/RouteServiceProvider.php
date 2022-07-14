<?php

namespace App\Providers;

use Exception;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * This is used by Laravel authentication to redirect users after login.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        $this->configureRateLimiting();

        $this->routes(function () {
            Route::middleware('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('admin')
                ->prefix('admin')
                ->group(base_path('routes/admin.php'));

            Route::middleware('web')
                ->prefix('web')
                ->group(base_path('routes/web.php'));
        });
    }

    /**
     * Configure the rate limiters for the application.
     *
     * @return void
     */
    protected function configureRateLimiting()
    {
        try {
            $difficulty = DB::connection('secure')
                ->table('staticdifficulties')
                ->value('rate_difficulty');
        }
        catch (Exception) {
            $difficulty = 1;
        }

        switch($difficulty) {
            //not a pretty implementation, but has to be like this as you can't pass maxAttempts at runtime
            case 1:
                RateLimiter::for('api', function (Request $request) {
                    return Limit::perMinute(10000)->by($request->cookie('tracker')? : $request->ip());
                });
                break;
            case 2:
                RateLimiter::for('api', function (Request $request) {
                    return Limit::perMinute(120)->by($request->cookie('tracker')? : $request->ip());
                });
                break;
            default:
                RateLimiter::for('api', function (Request $request) {
                    return Limit::perMinute(60)->by($request->cookie('tracker')? : $request->ip());
                });
                break;
        }

    }
}
