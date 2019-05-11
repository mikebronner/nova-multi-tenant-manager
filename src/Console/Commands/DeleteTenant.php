<?php namespace GeneaLabs\NovaMultiTenantManager\Console\Commands;

use GeneaLabs\NovaMultiTenantManager\Exceptions\TenantDoesNotExistException;
use GeneaLabs\NovaMultiTenantManager\Services\Tenant;
use Hyn\Tenancy\Models\Hostname;
use Illuminate\Console\Command;

class DeleteTenant extends Command
{
    protected $signature = 'tenant:delete {domain?} {--all : Deletes all tenants.}';
    protected $description = 'Deletes a tenant by the provided domain.';

    public function handle()
    {
        if ($this->option("all")) {
            $this->deleteAllTenants();

            return;
        }

        $domain = $this->argument('domain');

        try {
            if ($this->confirmDeletion($domain)) {
                $this->deleteTenant($domain);
            }
        } catch (TenantDoesNotExistException $exception) {
            $this->error($exception->getMessage());
        }
    }

    protected function confirmDeletion(string $domain) : bool
    {
        return "y" === $this->ask("Are you sure you want to delete tenant '{$domain}'? Type 'y' to confirm. [n]");
    }

    protected function confirmDeletionOfAllTenants() : bool
    {
        return "y" === $this->ask("Are you sure you want to delete ALL tenants? This operation is irreversible! Type 'y' to confirm. [n]");
    }

    protected function deleteAllTenants()
    {
        if (! $this->confirmDeletionOfAllTenants()) {
            return;
        }

        $hostnames = (new Hostname)
            ->with("website")
            ->get()
            ->each(function (Hostname $hostname) {
                $this->deleteTenant($hostname->fqdn);
            });
    }

    protected function deleteTenant(string $domain)
    {
        (new Tenant)->delete($domain);
        $this->info("✅  Tenant '{$domain}' successfully deleted.");
    }
}
