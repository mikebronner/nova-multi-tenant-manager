<?php

namespace GeneaLabs\NovaMultiTenantManager\Nova;

use Hyn\Tenancy\Models\Hostname;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Resource as NovaResource;

class Alias extends NovaResource
{
    public static $displayInNavigation = false;
    public static $model = Hostname::class;
    public static $title = 'fqdn';
    public static $search = [
        'id',
        'fqdn',
    ];

    public function authorizedToDelete(Request $request)
    {
        return false;
    }

    public function fields(Request $request)
    {
        return [
            ID::make()
                ->sortable(),
            Text::make("Domain", "fqdn"),
            Text::make("Redirect To"),
            Boolean::make("Force HTTPS", "force_https"),
            DateTime::make("Under Maintenance Since"),
        ];
    }

    public static function label()
    {
        return "Alias";
    }
}
