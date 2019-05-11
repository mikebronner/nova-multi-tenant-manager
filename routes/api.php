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

// Route::get("/", "GeneaLabs\NovaMultiTenantManager\Http\Controllers\Api\TenantController@index");
// Route::post("/", "GeneaLabs\NovaMultiTenantManager\Http\Controllers\Api\TenantController@store");
// Route::delete("/{id}", "GeneaLabs\NovaMultiTenantManager\Http\Controllers\Api\TenantController@delete");

Route::resource("tenants", "GeneaLabs\NovaMultiTenantManager\Http\Controllers\Api\TenantController");
Route::resource("settings", "GeneaLabs\NovaMultiTenantManager\Http\Controllers\Api\SettingController");
Route::resource("aliases", "GeneaLabs\NovaMultiTenantManager\Http\Controllers\Api\AliasController");
