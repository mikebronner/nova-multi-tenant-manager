<?php namespace GeneaLabs\NovaMultiTenantManager\Providers;

use GeneaLabs\NovaMultiTenantManager\Console\Commands\AliasTenant;
use GeneaLabs\NovaMultiTenantManager\Console\Commands\CreateTenant;
use GeneaLabs\NovaMultiTenantManager\Console\Commands\DeleteTenant;
use GeneaLabs\NovaMultiTenantManager\Console\Commands\Publish;
use GeneaLabs\NovaMultiTenantManager\Http\Middleware\Authorize;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class Tool extends ServiceProvider
{
    public function boot()
    {
        $this->loadViewsFrom(
            __DIR__ . '/../../resources/views',
            'genealabs-nova-multi-tenant-manager'
        );

        $this->publishes([
            __DIR__ . '/../../config/nova-multi-tenant-manager.php' => config_path('nova-multi-tenant-manager.php')
        ], 'config');

        $this->app->booted(function () {
            $this->routes();
        });
    }

    protected function routes()
    {
        if ($this->app->routesAreCached()) {
            return;
        }

        Route::middleware(['nova', Authorize::class])
            ->prefix('nova-vendor/genealabs-nova-multi-tenant-manager')
            ->group(__DIR__ . '/../../routes/api.php');
    }

    public function register()
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../../config/nova-multi-tenant-manager.php',
            'nova-multi-tenant-manager'
        );

        $this->commands(Publish::class);
        $this->commands(AliasTenant::class);
        $this->commands(CreateTenant::class);
        $this->commands(DeleteTenant::class);
    }
}
