# Nova Multi-Tenant Manager
Manage tenants and their settings in Laravel Nova.

![Multi-Tenant Manager for Laravel Nova masthead image.](https://repository-images.githubusercontent.com/186168087/0a8f8d80-f1b7-11e9-93ee-6399860d51f4)

## Requirements
- PHP >= 7.1.3
- Laravel 8.* (https://laravel.com)
- Laravel Nova 3.* (https://nova.laravel.com)
- Laravel Tenancy 5.7.* (https://laravel-tenancy.com)

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
- Configurable settings fields (implemented, needs documentation).
- Automatic integration with `genealabs/laravel-governor`.
- Extendible classes to allow custom integration with 3rd-party packages.
- Integrate CLI commands into tenancy namespace.
- Add unit tests.

## Usage
### CLI Commands
#### `tenant:create`
Creates a tenant with the provided domain name.
```sh
php artisan tenant:create <name> <domain>
```

#### `tenant:alias`
Creates an alias for an existing tenant with the provided domain name.
```sh
php artisan tenant:alias <domain> <alias>
```

#### `tenant:delete`
Deletes tenant by the provided domain, or delete all tenants.
```sh
php artisan tenant:delete <domain>
php artisan tenant:delete --all
```

### Nova Tools
#### Tenants Management
<img width="1267" alt="Screen Shot 2019-05-11 at 5 19 20 PM" src="https://user-images.githubusercontent.com/1791050/57576338-26298780-7412-11e9-8a16-44f465d20665.png">

#### Tenant Settings
<img width="1269" alt="Screen Shot 2019-05-11 at 5 19 07 PM" src="https://user-images.githubusercontent.com/1791050/57576337-26298780-7412-11e9-8169-bd1bb38a9924.png">
