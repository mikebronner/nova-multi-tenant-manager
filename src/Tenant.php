<?php namespace GeneaLabs\NovaMultiTenantManager;

use Hyn\Tenancy\Environment;
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

    public function getLogoAttribute() : string
    {
        return $this->settings['logo']
            ?? "";
    }

    public function getWatermarkAttribute() : string
    {
        return $this->settings['watermark']
            ?? "";
    }

    public function setLogoAttribute($value)
    {
        $settings = $this->settings;
        $settings['logo'] = $value;
        $this->settings = $settings;
    }

    public function setWatermarkAttribute($value)
    {
        $settings = $this->settings;
        $settings['watermark'] = $value;
        $this->settings = $settings;
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
}
