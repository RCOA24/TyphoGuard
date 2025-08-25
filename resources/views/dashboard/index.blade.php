@extends('layouts.app')

@section('content')
<div class="grid grid-cols-12 gap-6">
 

<div class="col-span-12 card w-full">
  <div class="card-head text-xl font-semibold">
    Detailed Weather & Live Radar — Philippines
  </div>
  <div class="card-body">
    
    <!-- Radar Map (full width, taller height) -->
    <div id="radar-map" style="height: 500px; margin-bottom: 30px;" class="rounded-lg shadow"></div>

    <!-- Weather Chart -->
    <div id="weather-chart-container" class="w-full">
      <canvas id="weather-chart" height="400"></canvas>
    </div>

    <!-- Attribution -->
    <p class="text-xs text-slate-500 mt-4">
      Weather data by 
      <a href="https://open-meteo.com" target="_blank" class="text-blue-500">Open-Meteo</a>
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
