<?php

declare(strict_types=1);

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        self::configureModels();
        self::configureVite();
        self::configureSchema();
        self::configureActions();
        self::configureCommands();
        self::configureDates();
    }

    private function configureModels(): void
    {
        Model::automaticallyEagerLoadRelationships();
        Model::unguard();
        Model::shouldBeStrict();
    }

    private function configureVite(): void
    {
        Vite::useAggressivePrefetching();
    }

    private function configureSchema(): void
    {
        URL::forceScheme('https');
    }

    private function configureActions(): void
    {
        //
    }

    private function configureCommands(): void
    {
        DB::prohibitDestructiveCommands(
            $this->app->environment('production') === true,
        );
    }

    private function configureDates(): void
    {
        Date::use(CarbonImmutable::class);
    }
}
