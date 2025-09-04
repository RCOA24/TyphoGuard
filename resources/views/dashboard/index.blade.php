@extends('layouts.app')

@section('content')

<div class="grid grid-cols-12 gap-6">
  
  <!-- Weather & Radar (Main Focus) -->
  <div class="col-span-12 lg:col-span-8 card">
    <div class="card-head">Detailed Weather & Live Radar — Philippines</div>
    <div class="card-body">
      <div id="radar-map" class="w-full h-64 mb-4"></div>
      
    <div class="overflow-x-auto py-4 px-2 relative touch-pan-x" style="scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;">
    <div id="weather-cards-container" class="flex gap-4 pb-2 snap-x"></div>
  </div>



      <p class="text-xs text-slate-500 mt-2">
        Weather data by <a href="https://open-meteo.com" target="_blank" class="text-blue-500">Open-Meteo</a>
      </p>
    </div>
  </div>

  

<!-- Common Ninja Weather Widget (Right Side) -->
<div class="col-span-12 lg:col-span-4 card">
  <div class="card-head">Pag-Asa Weather</div>
  <div class="card-body p-0">
    <script>
        (function(d, s, id) {
            if (d.getElementById(id)) {
                if (window.__TOMORROW__) {
                    window.__TOMORROW__.renderWidget();
                }
                return;
            }
            const fjs = d.getElementsByTagName(s)[0];
            const js = d.createElement(s);
            js.id = id;
            js.src = "https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js";

            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'tomorrow-sdk');
        </script>

        <div class="tomorrow"
           data-location-id=""
           data-language="EN"
           data-unit-system="METRIC"
           data-skin="dark"
           data-widget-type="upcoming"
           style="padding-bottom:22px;position:relative;"
        >
          <a
            href="https://weather.tomorrow.io/"
            rel="nofollow noopener noreferrer"
            target="_blank"
            style="position: absolute; bottom: 0; transform: translateX(-50%); left: 50%;"
          >
            <img
              alt="Powered by Tomorrow.io"
              src="https://weather-website-client.tomorrow.io/img/powered-by.svg"
              width="250"
              height="18"
            />
          </a>
        </div>
  </div>
</div>


<script src="{{ asset('js/radar.js') }}"></script>
<script src="{{ asset('js/dam.js') }}"></script>
<script src="{{ asset('js/tide.js') }}"></script>



<!-- Skycons JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/skycons/1396634940/skycons.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>


@endsection
