<?php

namespace GeneaLabs\NovaMultiTenantManager\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Panel;
use Laravel\Nova\Resource as NovaResource;

class Tenant extends NovaResource
{
    public static $displayInNavigation = false;
    public static $model = 'GeneaLabs\NovaMultiTenantManager\Tenant';
    public static $title = 'name';
    public static $search = [
        'id',
        'name',
    ];

    public function authorizedToDelete(Request $request)
    {
        return false;
    }

    public function fields(Request $request)
    {
        $fields = [
            ID::make()
                ->sortable(),
            Text::make("Name"),
            Text::make("Domain")
                ->rules("required"),
        ];

        if ($settings = config("nova-multi-tenant-manager.settings-fields-class")) {
            $fields = array_merge($fields, (new $settings)->make());
        }

        return $fields;
    }

    public static function label()
    {
        return "Site";
    }
}
