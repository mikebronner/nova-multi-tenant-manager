<?php namespace Genealabs\SiteSettings\Http\Controllers;

use App\Tenant;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Services\Tenant as TenantService;
use Hyn\Tenancy\Environment;
use Illuminate\Http\Response;
use Hyn\Tenancy\Models\Hostname;

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
