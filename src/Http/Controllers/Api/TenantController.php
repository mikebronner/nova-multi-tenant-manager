<?php namespace GeneaLabs\NovaMultiTenantManager\Http\Controllers\Api;

use GeneaLabs\NovaMultiTenantManager\Services\Tenant as TenantService;
use GeneaLabs\NovaMultiTenantManager\Tenant;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Support\Collection;

class TenantController extends Controller
{
    public function index() : Collection
    {
        return (new Tenant)
            ->with("website.hostnames")
            ->orderBy("name")
            ->get();
    }

    public function show() : Tenant
    {
        $tenant = (new Tenant)->findCurrent();
        $tenant->load("website.hostnames");

        return $tenant;
    }

    public function store(Request $request) : Tenant
    {
        $tenancyService = (new TenantService)
            ->create($request->domain);
        $tenant = (new Tenant)->firstOrNew([
                "website_id" => $tenancyService->website->id,
            ])
            ->fill($request->all());
        $tenant->save();

        return $tenant;
    }

    public function destroy(int $id) : Response
    {
        $tenant = (new Tenant)->findOrFail($id);
        (new TenantService)
            ->delete($tenant->domain);
        $tenant->delete();

        return response(null, 204);
    }
}
