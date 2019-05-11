<?php namespace GeneaLabs\NovaMultiTenantManager\Http\Controllers\Api;

use GeneaLabs\NovaMultiTenantManager\Services\Tenant as TenantService;
use GeneaLabs\NovaMultiTenantManager\Tenant;
use Hyn\Tenancy\Environment;
use Hyn\Tenancy\Models\Hostname;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;

class AliasController extends Controller
{
    public function store(Request $request) : Tenant
    {
        $hostname = app(Environment::class)->hostname();
        (new TenantService)->createAlias($hostname->fqdn, $request->alias);

        return (new Tenant)->findCurrent();
    }

    public function destroy(int $hostnameId) : Response
    {
        $hostname = (new Hostname)->find($hostnameId);
        $hostname->delete();

        return response(null, 204);
    }
}
