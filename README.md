# Nova Multi-Tenant Manager
Manage tenants and their settings in Laravel Nova.

## Installation
1. ```sh
   composer require "genealabs/nova-multi-tenant-manager:*"
   ```
2. Add the tool to your `app\Providers\NovaServiceProvider.php`:
   ```php
    public function tools()
    {
        return [
            // ...
            new GeneaLabs\NovaMultiTenantManager\NovaMultiTenantManager,
            // ...
        ];
    }
   ```

### Planned Features
- configurable settings fields
