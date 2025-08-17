@extends('layouts.app')

@section('content')
<div class="grid grid-cols-12 gap-6">
 

<!-- KPIs -->
<div class="col-span-12 md:col-span-4 card">
    <div class="card-head">Tide — Manila Bay</div>
    <div class="card-body">
        <div class="kpi"></div> <!-- will be filled by JS -->

      <p class="text-sm text-slate-500 next-high"></p> <!-- next high tide -->
       <p class="text-sm text-slate-500 next-low"></p> <!-- next low tide -->

       <div class="mt-2">
           <span class="badge-warn">Near threshold</span>
       </div>

        <!-- Chart container -->
        <div class="mt-4">
          <p class="text-xs text-slate-500 mt-2">High tide and Low Tide Data by <a href="https://open-meteo.com" target="_blank" class="text-blue-500">Open-Meteo</a></p>
            <canvas id="tideChart" height="250"></canvas>      
        </div>   

        
    </div>
</div>


<div class="col-span-12 md:col-span-8 card">
  <div class="card-head">Detailed Weather & Live Radar — Philippines</div>
  <div class="card-body">
    <!-- Radar Map -->
     
    <div id="radar-map" style="height: 300px; margin-bottom: 20px;"></div>

   <div id="weather-chart-container" style="width:100%;">
      <canvas id="weather-chart" width="1000" height="300"></canvas>
    </div>
    <p class="text-xs text-slate-500 mt-2">Weather data by<a href="https://open-meteo.com" target="_blank" class="text-blue-500">Open-Meteo</a>
    </p>
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

<!-- Map + Manila Bay Map -->
<div class="col-span-12 lg:col-span-8 card">
    <div class="card-head">Map (Manila Bay)</div>
    <div class="card-body">
        <div id="manila-bay-map" class="h-50 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <!-- Leaflet map will render here -->
        </div>
    </div>
</div>




<script src="{{ asset('js/radar.js') }}"></script>
<!-- Include your external weather JS -->
<script src="weather.js"></script>

<!-- Skycons JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/skycons/1396634940/skycons.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

@endsection
