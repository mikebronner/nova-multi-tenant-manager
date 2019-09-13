<?php

namespace GeneaLabs\NovaMultiTenantManager\Providers;

use GeneaLabs\NovaMultiTenantManager\Nova\Tenant;
use Laravel\Nova\Nova as LaravelNova;
use Laravel\Nova\NovaApplicationServiceProvider;

class Nova extends NovaApplicationServiceProvider
{
    protected function resources()
    {
        LaravelNova::resources([
            Tenant::class,
        ]);
    }
}
