<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UI\DashboardController;
use App\Http\Controllers\UI\DamController;
use App\Http\Controllers\UI\TideController;
use App\Http\Controllers\UI\AlertController;
use App\Http\Controllers\UI\WeatherController;
use App\Http\Controllers\RegionalForecastController;

Route::get('/', fn() => redirect('/dashboard'));
Route::get('/dashboard', [DashboardController::class,'index']);
Route::get('/dams', [DamController::class,'index']);
Route::get('/tides', [TideController::class,'index']);
Route::get('/alerts', [AlertController::class,'index']);

Route::get('/weather', [WeatherController::class,'index']);

Route::get('/dams/data', [DamController::class, 'fetchData']);



