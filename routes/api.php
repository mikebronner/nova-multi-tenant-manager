<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Tool API Routes
|--------------------------------------------------------------------------
|
| Here is where you may register API routes for your tool. These routes
| are loaded by the ServiceProvider of your tool. They are protected
| by your tool's "Authorize" middleware by default. Now, go build!
|
*/

Route::get("/", "Genealabs\NovaMultiTenantManager\Http\Controllers\Api\TenantController@index");
Route::post("/", "Genealabs\NovaMultiTenantManager\Http\Controllers\Api\TenantController@store");
Route::delete("/{id}", "Genealabs\NovaMultiTenantManager\Http\Controllers\Api\TenantController@delete");

Route::resource("tenants", "Genealabs\NovaMultiTenantManager\Http\Controllers\Api\SettingController");
Route::resource("aliases", "Genealabs\NovaMultiTenantManager\Http\Controllers\Api\AliasController");
