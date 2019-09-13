<?php namespace GeneaLabs\NovaMultiTenantManager;

use Hyn\Tenancy\Traits\UsesSystemConnection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Collection;

class Tenant extends Model
{
    use UsesSystemConnection;

    protected $appends = [
        "aliases",
    ];
    protected $casts = [
        "settings" => "array",
    ];
    protected $fillable = [
        "domain",
        "name",
    ];

    public function website() : BelongsTo
    {
        return $this->belongsTo(config('tenancy.models.website'));
    }

    public function getAliasesAttribute() : Collection
    {
        $this->load("website.hostnames");

        if (! $this->website
            || !$this->website->hostnames
        ) {
            return collect();
        }

        $hostnames = $this
            ->website
            ->hostnames;
        $hostnames->shift();

        return $hostnames;
    }
}
