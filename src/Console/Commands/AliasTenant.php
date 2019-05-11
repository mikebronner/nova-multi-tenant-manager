<?php namespace GeneaLabs\NovaMultiTenantManager\Console\Commands;

use GeneaLabs\NovaMultiTenantManager\Exceptions\TenantExistsException;
use GeneaLabs\NovaMultiTenantManager\Services\Tenant;
use Illuminate\Console\Command;

class AliasTenant extends Command
{
    protected $signature = 'tenant:alias {domain} {alias}';
    protected $description = 'Creates an alias for an existing tenant with the provided domain name.';

    public function handle()
    {
        $alias = $this->argument('alias');
        $domain = $this->argument('domain');

        try {
            (new Tenant)->createAlias($domain, $alias);
            $this->info("✅  New alias for tenant '{$domain}' created and now accessible at 'https://{$alias}'.");
        } catch (TenantExistsException $exception) {
            $this->error($exception->getMessage());
        }
    }
}
