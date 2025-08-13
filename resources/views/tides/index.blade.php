@extends('layouts.app')
@section('content')
<div class="space-y-6" x-data="{ lat:14.5995, lon:120.9842, date:new Date().toISOString().slice(0,10) }">
  <div class="card">
    <div class="card-head">Tide Forecast (Prototype)</div>
    <div class="card-body space-y-4">
      <div class="grid sm:grid-cols-3 gap-3">
        <div>
          <label class="text-xs text-slate-500">Latitude</label>
          <input type="number" step="0.0001" x-model="lat" class="mt-1 w-full">
        </div>
        <div>
          <label class="text-xs text-slate-500">Longitude</label>
          <input type="number" step="0.0001" x-model="lon" class="mt-1 w-full">
        </div>
        <div>
          <label class="text-xs text-slate-500">Date</label>
          <input type="date" x-model="date" class="mt-1 w-full">
        </div>
      </div>
      <div class="grid sm:grid-cols-3 gap-4">
        <div class="card"><div class="card-body"><div class="text-sm text-slate-500">Next High</div><div class="kpi">1.82 m</div><p class="text-xs text-slate-500">14:05</p></div></div>
        <div class="card"><div class="card-body"><div class="text-sm text-slate-500">Next Low</div><div class="kpi">0.27 m</div><p class="text-xs text-slate-500">20:17</p></div></div>
        <div class="card"><div class="card-body"><div class="text-sm text-slate-500">Range</div><div class="kpi">1.55 m</div><p class="text-xs text-slate-500">Daily</p></div></div>
      </div>
      <div class="h-56 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
        Tide chart goes here
      </div>
    </div>
  </div>
</div>
@endsection
