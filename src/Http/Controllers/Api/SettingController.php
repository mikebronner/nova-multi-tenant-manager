<?php namespace Genealabs\MultiTenantManager\Http\Controllers;

use App\Tenant;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class TenantController extends Controller
{
    public function index() : Tenant
    {
        $tenant = (new Tenant)->findCurrent();
        $tenant->load("website.hostnames");

        return $tenant;
    }

    public function update(Request $request, Tenant $tenant) : Tenant
    {
        $tenant->fill($request->all());

        if ($request->hasFile("logo")) {
            $tenant->logo = $request->logo->store("media", "tenant");
        }

        if ($request->hasFile("watermark")) {
            $tenant->watermark = $request->watermark->store("media", "tenant");
        }

        $tenant->save();

        return $tenant;
    }
}
