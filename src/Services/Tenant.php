<?php namespace GeneaLabs\NovaMultiTenantManager\Services;

use GeneaLabs\NovaMultiTenantManager\Exceptions\TenantDoesNotExistException;
use GeneaLabs\NovaMultiTenantManager\Exceptions\TenantExistsException;
use GeneaLabs\NovaMultiTenantManager\Tenant as TenantModel;
use Hyn\Tenancy\Contracts\Repositories\HostnameRepository;
use Hyn\Tenancy\Contracts\Repositories\WebsiteRepository;
use Hyn\Tenancy\Environment;
use Hyn\Tenancy\Models\Hostname;
use Hyn\Tenancy\Models\Website;
use Illuminate\Support\Str;

class Tenant
{
    protected $admin;
    public $hostname;
    public $website;

    public function __construct(Hostname $hostname = null, Website $website = null)
    {
        $this->hostname = $hostname;
        $this->website = $website;
    }
    
    public function create(string $domain = "", string $name = "") : self
    {
        $domain = $this->cleanDomain($domain);

        if ($this->exists($domain)) {
            if (! $this->website) {
                $this->createWebsite($domain);
            }

            $this->createTenant($domain, $name);

            throw new TenantExistsException("Tenant with domain '{$domain}' already exists.");
        }

        $this->createWebsite($domain);
        $this->createHostname($domain);
        $this->switchToTenant();
        $this->createTenant($domain, $name);

        return $this;
    }

    public function createAlias(string $domain = "", string $alias = "") : self
    {
        $alias = $this->cleanDomain($alias);

        if ($this->exists($alias)) {
            return $this;
        }

        $originalHostname = (new Hostname)
            ->with("website")
            ->where("fqdn", $domain)
            ->first();
        $newHostname = new Hostname;
        $newHostname->fqdn = $alias;
        $newHostname = app(HostnameRepository::class)
            ->create($newHostname);
        app(HostnameRepository::class)
            ->attach($newHostname, $originalHostname->website);

        return $this;
    }

    public function delete(string $domain = "") : self
    {
        if (! $this->exists($domain)) {
            throw new TenantDoesNotExistException("A tenant with domain '{$domain}' does not exist.");
        }

        if ($domain) {
            $this->findByDomain($domain);
        }

        if ($this->hostname) {
            $this->hostname = app(HostnameRepository::class)->delete($this->hostname, true);
        }

        if ($this->website) {
            $this->website->load("hostnames");

            if ($this->website->hostnames->isEmpty()) {
                $this->website = app(WebsiteRepository::class)->delete($this->website, true);
            }
        }

        return $this;
    }

    public function findByDomain(string $domain) : self
    {
        $this->hostname = (new Hostname)
            ->with("website")
            ->where("fqdn", $domain)
            ->first();
        
        if ($this->hostname) {
            $this->website = $this->hostname->website;
        }

        return $this;
    }

    public function findCurrent() : ?self
    {
        $website = app(Environment::class)->tenant();

        if (! $website) {
            return $this;
        }

        return $this
            ->where("website_id", $website->id)
            ->first();
    }

    public function findCurrentHostname() : Hostname
    {
        return app(Environment::class)
            ->hostname();
    }

    protected function cleanDomain(string $domain) : string
    {
        return preg_replace('/.*?\:?\/\/(.*)/', "$1", $domain);
    }

    protected function createTenant(string $domain, string $name)
    {
        $tenant = (new TenantModel)
            ->firstOrNew([
                "domain" => $domain,
            ]);
        $tenant->name = $name;
        $tenant->website_id = $this->website->id;
        $tenant->save();
    }

    protected function createWebsite(string $domain) : Website
    {
        $this->website = new Website;

        if (config('tenancy.website.disable-random-id') === true) {
            $this->website->uuid = Str::slug($domain);

            if (config('tenancy.website.uuid-limit-length-to-32')) {
                $this->website->uuid = substr($this->website->uuid, -32);
            }
        }

        return app(WebsiteRepository::class)
            ->create($this->website);
    }

    protected function createHostname(string $domain)
    {
        $this->hostname = new Hostname;
        $this->hostname->fqdn = $domain;
        $this->hostname = app(HostnameRepository::class)
            ->create($this->hostname);
        app(HostnameRepository::class)
            ->attach($this->hostname, $this->website);
    }

    public function switchToTenant(TenantModel $tenant = null)
    {
        if ($tenant) {
            $tenant->load("website");
            $website = $tenant->website;
        }

        app(Environment::class)->tenant($website ?? $this->website);
    }

    public function exists(string $domain) : bool
    {
        $hostname = (new Hostname)
            ->with("website")
            ->where('fqdn', $domain)
            ->first();
        $this->hostname = $hostname;
        $this->website = optional($hostname)->website;

        return optional($hostname)->exists()
            ?: false;
    }
}
