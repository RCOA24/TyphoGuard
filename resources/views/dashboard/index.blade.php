@extends('layouts.app')

@section('content')

    <div class="grid grid-cols-12 gap-6">
    

    <div class="col-span-8 md:col-span-12 card">
      <div class="card-head">Detailed Weather & Live Radar — Philippines</div>
      <div class="card-body">
        <!-- Radar Map -->
        
        <div id="radar-map" style="height: 300px; margin-bottom: 20px;"></div>

      <div id="weather-chart-container" style="width:100%;">
          <canvas id="weather-chart" width="100%" height="300"></canvas>
        </div>
        <p class="text-xs text-slate-500 mt-2">Weather data by<a href="https://open-meteo.com" target="_blank" class="text-blue-500"> Open-Meteo</a>
        </p>
      </div>
    </div>

<script src="{{ asset('js/radar.js') }}"></script>
<!-- Include your external weather JS -->
<script src="weather.js"></script>
<script src="{{ asset('js/dam.js') }}"></script>
<script src="{{ asset('js/tide.js') }}"></script>



<!-- Skycons JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/skycons/1396634940/skycons.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

@endsection
