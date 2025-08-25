@extends('layouts.app')
@section('content')
<div class="space-y-6" 
     x-data="tideApp()" 
     x-init="init()">
  <div class="card">
    <div class="card-head">Tide Forecast (Prototype)</div>
    <div class="card-body space-y-4">

      <!-- Station Selector + Lat/Lon/Date -->
      <div class="grid sm:grid-cols-4 gap-3">
        <div>
          <label class="text-xs text-slate-500">Station</label>
          <select 
            x-model="selectedStation" 
            @change="setStation($event)" 
            class="mt-1 w-full border rounded-lg px-2 py-1 text-slate-700 bg-white dark:bg-slate-900 dark:text-slate-200">
            <option value="">-- Select Station --</option>
            <template x-for="(s, i) in stations" :key="i">
              <option :value="i" x-text="`${s.Station} (${s.State})`"></option>
            </template>
          </select>
        </div>
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

      <!-- KPI Cards -->
      <div class="grid sm:grid-cols-3 gap-4">
        <div class="card">
          <div class="card-body">
            <div class="text-sm text-slate-500">Next High</div>
            <div class="kpi" id="next-high-value">-- m</div>
            <p class="text-xs text-slate-500" id="next-high-time">--</p>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="text-sm text-slate-500">Next Low</div>
            <div class="kpi" id="next-low-value">-- m</div>
            <p class="text-xs text-slate-500" id="next-low-time">--</p>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="text-sm text-slate-500">Range</div>
            <div class="kpi" id="tide-range">-- m</div>
            <p class="text-xs text-slate-500">Daily</p>
          </div>
        </div>
      </div>

      <!-- Chart -->
      <div class="h-56 sm:h-72 lg:h-96 rounded-lg bg-slate-100 dark:bg-slate-800 p-2">
        <canvas id="tideChartFull"></canvas>
      </div>

      <p class="text-xs text-slate-500 mt-2">
        High tide and Low Tide Data by 
        <a href="https://open-meteo.com" target="_blank" class="text-blue-500">Open-Meteo</a>
      </p>

    </div>
  </div>
</div>

<!-- Add Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<!-- Add tide.js -->
<script src="{{ asset('js/tide.js') }}"></script>
@endsection
@section('scripts')