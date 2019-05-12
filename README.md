# Nova Multi-Tenant Manager
Manage tenants and their settings in Laravel Nova.

## Requirements
- PHP >= 7.1.3
- Laravel 5.8.* (https://laravel.com)
- Laravel Nova 2.* (https://nova.laravel.com)
- Laravel Tenancy 5.4.* (https://laravel-tenancy.com)

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
- Configurable settings fields.
- Automatic integration with `genealabs/laravel-governor`.
- Extendible classes to allow custom integration with 3rd-party packages.

## Usage
### CLI Commands
#### `tenant:create`
// coming soon

#### `tenant:alias`
// coming soon

#### `tenant:delete`
// coming soon

### Nova Tools
#### Tenants Management
<img width="1267" alt="Screen Shot 2019-05-11 at 5 19 20 PM" src="https://user-images.githubusercontent.com/1791050/57576338-26298780-7412-11e9-8a16-44f465d20665.png">

#### Tenant Settings
<img width="1269" alt="Screen Shot 2019-05-11 at 5 19 07 PM" src="https://user-images.githubusercontent.com/1791050/57576337-26298780-7412-11e9-8169-bd1bb38a9924.png">
