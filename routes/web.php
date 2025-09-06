<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\UI\DashboardController;
use App\Http\Controllers\UI\DamController;
use App\Http\Controllers\UI\TideController;
use App\Http\Controllers\UI\AboutController;
use App\Http\Controllers\UI\WeatherController;
use App\Http\Controllers\RegionalForecastController;

// Redirect root → dashboard
Route::get('/', fn() => redirect('/dashboard'));

// UI routes
Route::get('/dashboard', [DashboardController::class,'index']);
Route::get('/dams', [DamController::class,'index']);
Route::get('/tides', [TideController::class,'index']);
Route::get('/about', [AboutController::class,'index']);
Route::get('/weather', [WeatherController::class,'index']);

// Data routes
Route::get('/dams/data', [DamController::class, 'fetchData']);


