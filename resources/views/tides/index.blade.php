@extends('layouts.app')
@section('content')
<div x-data="tideApp()" x-init="init()" class="space-y-6">

  <!-- Consent Modal -->
  <div 
     x-show="showConsentModal" 
     x-transition:enter="transition ease-out duration-300"
     x-transition:enter-start="opacity-0 backdrop-blur-0"
     x-transition:enter-end="opacity-100 backdrop-blur-lg"
     x-transition:leave="transition ease-in duration-200"
     x-transition:leave-start="opacity-100 backdrop-blur-lg"
     x-transition:leave-end="opacity-0 backdrop-blur-0"
     class="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
     style="display: none;">
     
    <div 
         x-transition:enter="transition transform duration-300"
         x-transition:enter-start="scale-95 opacity-0"
         x-transition:enter-end="scale-100 opacity-100"
         x-transition:leave="transition transform duration-200"
         x-transition:leave-start="scale-100 opacity-100"
         x-transition:leave-end="scale-95 opacity-0"
         class="bg-white dark:bg-slate-900 rounded-lg p-6 w-80 sm:w-96 shadow-lg">
         
        <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Use Your Location?</h2>
        <p class="text-sm text-slate-600 dark:text-slate-300 mb-6">
            This site will use your location to show tide data. Do you want to continue?
        </p>
        <div class="flex justify-end space-x-2">
            <button @click="showConsentModal = false" class="px-3 py-1 rounded border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                Cancel
            </button>
            <button @click="confirmLocation()" class="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">
                Yes
            </button>
        </div>
    </div>
  </div>


  <div class="card">
    <div class="card-head">Tide Forecast (Prototype)</div>
    <div class="card-body space-y-4">

      <!-- Modern Floating Loader -->
      <div 
          x-show="loadingLocation"
          x-transition
          class="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-lg rounded-xl px-4 py-2">
          
          <!-- Spinner -->
          <div class="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          
          <!-- Text -->
          <span class="text-sm font-medium text-slate-700 dark:text-slate-200">
              Getting location...
          </span>
      </div>

      <div class="grid sm:grid-cols-4 gap-3">
        
        <!-- Region Dropdown -->
        <div>
          <label class="text-xs text-slate-500">Region</label>
          <select 
            x-model="selectedRegion"
            @change="selectedStation=''" 
            class="mt-1 w-full border rounded-lg px-2 py-1 text-slate-700 bg-white dark:bg-slate-900 dark:text-slate-200">
            <option value="">-- Select Region --</option>
            <template x-for="(region, rIndex) in stations" :key="rIndex">
              <option :value="rIndex" x-text="region.region"></option>
            </template>
          </select>

          <!-- Refresh Data -->
        <div class="sm:col-span-2 flex items-end">
          <button type="button"
            class="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition"
            @click="refreshData">
            Refresh Data
          </button>
        </div>
        </div>
        

        <!-- Station Dropdown -->
        <div>
          <label class="text-xs text-slate-500">Station</label>
          <select 
            x-model="selectedStation" 
            @change="setStation($event)" 
            :disabled="selectedRegion === ''"
            class="mt-1 w-full border rounded-lg px-2 py-1 text-slate-700 bg-white dark:bg-slate-900 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <option value="">-- Select Station --</option>

            <!-- User Location -->
            <template x-if="userLocation">
              <option value="user" x-text="userLocation"></option>
            </template>

            <!-- Show stations only if region is picked -->
            <template x-if="selectedRegion !== ''">
              <template x-for="(s, sIndex) in stations[selectedRegion].stations" :key="sIndex">
                <option :value="`${selectedRegion}-${sIndex}`" x-text="s.station"></option>
              </template>
            </template>
          </select>
        </div>

        <!-- Latitude -->
        <div>
          <label class="text-xs text-slate-500">Latitude</label>
          <input type="number" step="0.0001" x-model="lat" class="mt-1 w-full border rounded px-2 py-1">
        </div>

        <!-- Longitude -->
        <div>
          <label class="text-xs text-slate-500">Longitude</label>
          <input type="number" step="0.0001" x-model="lon" class="mt-1 w-full border rounded px-2 py-1">
        </div>

        <!-- Date -->
        <div>
          <label class="text-xs text-slate-500">Date</label>
          <input type="date" x-model="date" class="mt-1 w-full border rounded px-2 py-1">
        </div>

        <!-- Use My Location -->
        <div class="sm:col-span-3 flex items-end">
          <button type="button"
            class="w-full px-3 py-2 bg-slate-700 hover:bg-slate-900 text-white rounded-lg shadow transition"
            @click="showConsentModal = true">
            Use My Location
          </button>
        </div>

        
      </div>


      <!-- KPI Cards -->
      <div class="grid sm:grid-cols-3 gap-4" x-show="showData" x-transition.opacity.duration.300ms>
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
      <div class="h-56 sm:h-72 lg:h-96 rounded-lg bg-slate-100 dark:bg-slate-800 p-2" x-show="showData" x-transition.scale.opacity.duration.300ms>
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
