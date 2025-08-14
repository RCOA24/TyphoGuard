@extends('layouts.app')

@section('content')
<div class="grid grid-cols-12 gap-6">
  <!-- Hero / Alert -->
  <div class="col-span-12 card overflow-hidden">
    <div class="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold">Situational Awareness (Prototype)</h1>
        <p class="text-sm text-slate-500">Real-time water & weather intelligence for PH communities.</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="badge-ok">Systems nominal</span>
        <span class="badge-warn">2 advisories</span>
      </div>
    </div>
  </div>

<!-- KPIs -->
<div class="col-span-12 md:col-span-4 card">
    <div class="card-head">Tide — Manila Bay</div>
    <div class="card-body">
        <div class="kpi">High in 2h 15m</div>
        <p class="text-sm text-slate-500 next-high">Next high: 1.82 m @ 14:05</p>

        <!-- Chart container -->
        <div class="mt-4">
            <canvas id="tideChart" height="150"></canvas>
        </div>
    </div>
</div>


  <div class="col-span-12 md:col-span-4 card">
    <div class="card-head">Dam — Angat</div>
    <div class="card-body">
      <div class="kpi">209.3 m</div>
      <p class="text-sm text-slate-500">Normal High Water Level: 210 m</p>
      <div class="mt-2"><span class="badge-warn">Near threshold</span></div>
      <div class="mt-4 h-22 rounded-lg bg-gradient-to-t from-amber-100 to-white dark:from-amber-900/30 dark:to-transparent"></div>
    </div>
  </div>

  <div class="col-span-12 md:col-span-4 card">
    <div class="card-head">Tropical System</div>
    <div class="card-body">
      <div class="kpi">No active signal</div>
      <p class="text-sm text-slate-500">Monitoring PAGASA advisories</p>
      <div class="mt-4 h-22 rounded-lg bg-gradient-to-t from-emerald-100 to-white dark:from-emerald-900/30 dark:to-transparent"></div>
    </div>
  </div>

  <!-- Map placeholder + right panel -->
  <div class="col-span-12 lg:col-span-8 card">
    <div class="card-head">Map (placeholder)</div>
    <div class="card-body">
      <div class="h-60 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
        Embed leaflet map / radar here
      </div>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-4 space-y-6">
    <div class="card">
      <div class="card-head">Active Advisories</div>
      <div class="card-body space-y-3">
        <div class="flex items-start justify-between">
          <div>
            <p class="font-medium text-sm">Urban flood watch</p>
            <p class="text-xs text-slate-500">Quezon City · Next 6 hours</p>
          </div>
          <span class="badge-warn">Watch</span>
        </div>
        <div class="flex items-start justify-between">
          <div>
            <p class="font-medium text-sm">Dam release readiness</p>
            <p class="text-xs text-slate-500">Angat · Standby only</p>
          </div>
          <span class="badge-danger">Heads-up</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-head">Quick Actions</div>
      <div class="card-body grid grid-cols-2 gap-3">
        <a href="{{ url('/dams') }}" class="px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">View Dams</a>
        <a href="{{ url('/tides') }}" class="px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">View Tides</a>
      </div>
    </div>
  </div>
</div>


<script src="{{ asset('js/tide.js') }}"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

@endsection
