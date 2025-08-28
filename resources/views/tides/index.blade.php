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
          <div class="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-sm font-medium text-slate-700 dark:text-slate-200">Getting location...</span>
      </div>

      <div class="grid sm:grid-cols-4 gap-3">
        
                  <!-- Region Dropdown -->
                  <div>
                    <label class="text-xs text-slate-500 flex items-center gap-1">
                  <!-- Map Icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.553-.894L9 7l6-3 5.447 2.724A1 1 0 0121 7.618v10.764a1 1 0 01-1.553.894L15 17l-6 3z" />
                  </svg>
                  Region
                </label>

                  <div class="relative mt-1">
            <!-- Region/Map Icon -->
            <svg class="w-5 h-5 absolute left-3 top-2.5 text-indigo-500 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.553-.894L9 7l6-3 5.447 2.724A1 1 0 0121 7.618v10.764a1 1 0 01-1.553.894L15 17l-6 3z" />
            </svg>

            <!-- Chevron Icon -->
            <svg class="w-5 h-5 absolute right-3 top-2.5 text-slate-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>

            <!-- Modern Select -->
            <select 
              x-model="selectedRegion"
              @change="selectedStation=''"
              class="appearance-none pl-10 pr-10 w-full border border-slate-300 dark:border-slate-700 rounded-xl py-2 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition">
              
              <option value="">-- Select Region --</option>
              <template x-for="(region, rIndex) in stations" :key="rIndex">
                <option :value="rIndex" x-text="region.region"></option>
              </template>
            </select>
          </div>
        </div>
      <div>
       
        <!-- Label with Location Icon -->
        <label class="text-xs text-slate-500 flex items-center gap-1">
          <!-- Location Pin Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 22s8-7.582 8-13a8 8 0 10-16 0c0 5.418 8 13 8 13z" />
          </svg>
          Location
        </label>

       <!-- location Dropdown -->
          <div class="relative mt-1">
  <!-- Location Icon -->
  <svg class="w-5 h-5 absolute left-3 top-2.5 text-rose-500 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M12 22s8-7.582 8-13a8 8 0 10-16 0c0 5.418 8 13 8 13z" />
  </svg>

  <!-- Chevron Icon (dropdown indicator) -->
  <svg class="w-5 h-5 absolute right-3 top-2.5 text-slate-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
  </svg>

  <!-- Modern Dropdown -->
  <select
    x-model="selectedStation"
    @change="setStation($event)"
    :disabled="selectedRegion === ''"
    class="appearance-none pl-10 pr-10 w-full border border-slate-300 dark:border-slate-700 rounded-xl py-2 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 shadow-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition">
    
    <option value="">-- Select Location --</option>
    
    <template x-if="userLocation">
      <option value="user" x-text="userLocation"></option>
    </template>

    <template x-if="selectedRegion !== ''">
      <template x-for="(s, sIndex) in stations[selectedRegion].stations" :key="sIndex">
        <option :value="`${selectedRegion}-${sIndex}`" x-text="s.station"></option>
      </template>
    </template>
  </select>
</div>
 </div>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <!-- Latitude -->
  <div>
    <label class="text-xs text-slate-500 flex items-center gap-1">
      <!-- Location Marker Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 22s8-7.582 8-13a8 8 0 10-16 0c0 5.418 8 13 8 13z" />
      </svg>
      Latitude
    </label>
    <input 
      type="text"
      inputmode="decimal"
      x-model="lat"
      placeholder="Latitude"
      readonly
      class="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-slate-700 dark:text-slate-300 shadow-sm cursor-not-allowed"
    />
  </div>

  <!-- Longitude -->
  <div>
    <label class="text-xs text-slate-500 flex items-center gap-1">
      <!-- Compass Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 2a10 10 0 100 20 10 10 0 000-20zm2.93 5.07L13 13l-5.93 1.93L11 11l3.93-3.93z" />
      </svg>
      Longitude
    </label>
    <input 
      type="text"
      inputmode="decimal"
      x-model="lon"
      placeholder="Longitude"
      readonly
      class="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-slate-700 dark:text-slate-300 shadow-sm cursor-not-allowed"
    />
  </div>
</div>



      <!-- Date -->
<div>
  <label class="text-xs text-slate-500 flex items-center gap-1">
    <!-- Calendar Icon -->
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    Date
  </label>
  <div class="relative mt-1">
    <!-- Positioned Icon -->
    <svg class="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none"
      viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <input
      type="date"
      x-model="date"
      class="pl-10 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-700 dark:text-slate-200 shadow-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition placeholder:text-slate-400"
    />
  </div>
</div>


         <!-- Use My Location -->
        <div class="sm:col-span-4 flex items-end">
          <button 
            type="button"
            @click="showConsentModal = true"
            class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-md hover:from-slate-600 hover:to-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200">
            <!-- Location Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zM12 22s8-7.582 8-13a8 8 0 10-16 0c0 5.418 8 13 8 13z" />
            </svg>
            Use My Location
          </button>
        </div>
              <!-- Refresh Data -->
        <div class="sm:col-span-4 flex items-end">
          <button 
            type="button"
            @click="refreshData"
            class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-md hover:from-slate-600 hover:to-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all duration-200">
            <!-- Refresh Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v6h6M20 20v-6h-6"/>
            </svg>
            Refresh Data
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid sm:grid-cols-3 gap-4 mt-4" x-show="showData" x-transition.opacity.duration.300ms>
        <!-- Next High -->
        <div class="card hover:shadow-md transition">
          <div class="card-body flex items-center gap-3">

            <!-- SVG ARROW -->
           <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19V5m-7 7l7-7 7 7" />
          </svg>

            <div>
              <div class="text-xs text-slate-500">Next High</div>
              <div class="kpi text-blue-600 dark:text-blue-400" id="next-high-value">-- m</div>
              <p class="text-xs text-slate-500" id="next-high-time">--</p>
            </div>
          </div>
        </div>
        <!-- Next Low -->
        <div class="card hover:shadow-md transition">
          <div class="card-body flex items-center gap-3">

              <!-- SVG ARROW -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7-7l7 7-7 7" transform="rotate(90 12 12)" />
            </svg>

            <div>
              <div class="text-xs text-slate-500">Next Low</div>
              <div class="kpi text-rose-600 dark:text-rose-400" id="next-low-value">-- m</div>
              <p class="text-xs text-slate-500" id="next-low-time">--</p>
            </div>
          </div>
        </div>
        
        <!-- Range -->
        <div class="card hover:shadow-md transition">
          <div class="card-body flex items-center gap-3">

            <!-- SVG ARROW -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7-7l7 7-7 7" />
          </svg>

            <div>
              <div class="text-xs text-slate-500">Range</div>
              <div class="kpi text-emerald-600 dark:text-emerald-400" id="tide-range">-- m</div>
              <p class="text-xs text-slate-500">Daily</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart -->
      <div class="h-56 sm:h-72 lg:h-96 rounded-lg bg-slate-100 dark:bg-slate-800 p-2 mt-4" x-show="showData" x-transition.scale.opacity.duration.300ms>
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
