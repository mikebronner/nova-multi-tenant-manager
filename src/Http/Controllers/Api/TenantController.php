<?php namespace GeneaLabs\NovaMultiTenantManager\Http\Controllers\Api;

//TODO: extract user class out to configuration
use App\User;
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
        //TODO: extract permission management out to configuration classes to be implemented by user
        $superAdmins = (new User)
            ->with("roles")
            ->whereHas("roles", function ($query) {
                $query->where("name", "SuperAdmin");
            })
            ->get();
        $tenancyService = (new TenantService)
            ->create($request->domain);
        $tenant = (new Tenant)->firstOrNew([
                "website_id" => $tenancyService->website->id,
            ])
            ->fill($request->all());
        $tenant->save();

        if ($request->filled("adminEmail")) {
            $admin = (new User)->firstOrNew([
                "email" => $request->adminEmail,
            ]);
            $admin->name = $request->adminName;
            $admin->password = str_random(32);
            $admin->save();
            $admin->roles()->attach("Admin");
        }

        $superAdmins->each(function ($superAdmin) {
            $user = (new User)->firstOrNew([
                    "email" => $superAdmin->email,
                ])
                ->fill([
                    "name" => $superAdmin->name,
                    "email_verified_at" => $superAdmin->email_verified_at,
                ]);
            $user->password = $superAdmin->password;
            $user
                ->setConnection("tenant")
                ->save();
            $user->roles()->attach("SuperAdmin");
        });

        return $tenant;
    }

    public function update(Request $request, Tenant $tenant) : Tenant
    {
        $tenant->fill($request->all());
\Log::debug($request->all());
        if ($request->hasFile("logo")) {
            $tenant->logo = $request->logo->store("media", "tenant");
        }

        if ($request->hasFile("watermark")) {
            $tenant->watermark = $request->watermark->store("media", "tenant");
        }

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
