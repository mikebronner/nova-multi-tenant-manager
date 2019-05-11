<?php namespace GeneaLabs\NovaMultiTenantManager\Console\Commands;

use GeneaLabs\NovaMultiTenantManager\Exceptions\TenantExistsException;
use GeneaLabs\NovaMultiTenantManager\Services\Tenant;
use Illuminate\Console\Command;

class CreateTenant extends Command
{
    protected $signature = 'tenant:create {name} {domain}';
    protected $description = 'Creates a tenant with the provided domain name.';

    public function handle()
    {
        $domain = $this->argument('domain');
        $name = $this->argument('name');

        try {
            (new Tenant)->create($domain, $name);
            $this->info("✅  New tenant created and now accessible at 'https://{$domain}'.");
        } catch (TenantExistsException $exception) {
            $this->error($exception->getMessage());
        }
    }
}
