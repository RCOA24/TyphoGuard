<!doctype html>
<html lang="en" x-data="{ sidebar:false, dark: localStorage.getItem('dark')==='1' }" 
      x-init="$watch('dark', v => { localStorage.setItem('dark', v?'1':'0'); document.documentElement.classList.toggle('dark', v) }); if(dark){document.documentElement.classList.add('dark')}"
      class="h-full">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>TyphoGuard</title>
  <!-- If using PNG -->
   <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
   <link rel="icon" type="image/png" href="{{ asset('images/guard.png') }}" sizes="32x32">

  @vite([
      'resources/css/app.css',
      'resources/js/app.js',
      'resources/js/ph-time.js',
      'resources/js/manila-bay-map.js'
  ])
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    
</head>
<body class="h-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
  <!-- Topbar -->
  <header class="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200/70 dark:border-slate-800">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button class="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 sm:hidden" @click="sidebar=true">
          <!-- Menu icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
       <a href="{{ url('/') }}" class="font-bold tracking-tight flex items-center">
        <img src="{{ asset('images/guard.png') }}" alt="TyphoGuard Logo" class="h-6 w-6 mr-2"> TyphoGuard</a>
        <span class="ml-2 text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-400/10 dark:text-sky-400"> Beta
     </span>

      </div>
      <div class="flex items-center gap-3">
        <button @click="dark=!dark" class="text-sm px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
          <span x-show="!dark">Dark</span><span x-show="dark">Light</span> Mode
        </button>
      </div>
    </div>
  </header>

  <!-- Shell -->
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-6 py-6">
    <!-- Sidebar -->
    <aside class="hidden sm:block col-span-3 lg:col-span-2">
      <nav class="card p-2">
        <x-nav-link href="{{ url('/dashboard') }}" label="Dashboard" icon="activity"/>
        <x-nav-link href="{{ url('/dams') }}" label="Dams" icon="droplet"/>
        <x-nav-link href="{{ url('/tides') }}" label="Tides" icon="waves"/>
        <x-nav-link href="{{ url('/alerts') }}" label="Alerts & Guides" icon="bell"/>
      </nav>
      <div class="mt-4 card">
        <div class="card-head">System</div>
        <div class="card-body">
    <p class="text-sm text-slate-500">
        PH Timezone (Asia/Manila): 
        <span id="ph-time">Loading...</span>
    </p>
</div>

      </div>
    </aside>

    <!-- Mobile Drawer -->
    <div x-cloak x-show="sidebar" @keydown.escape.window="sidebar=false"
         class="fixed inset-0 z-50 sm:hidden">
      <div @click="sidebar=false" class="absolute inset-0 bg-black/40"></div>
      <aside class="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 p-4">
        <div class="flex items-center justify-between mb-4">
          <span class="font-semibold">Menu</span>
          <button @click="sidebar=false" class="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
            ✕
          </button>
        </div>
        <nav class="space-y-1">
          <x-nav-link href="{{ url('/dashboard') }}" label="Dashboard" icon="activity"/>
          <x-nav-link href="{{ url('/dams') }}" label="Dams" icon="droplet"/>
          <x-nav-link href="{{ url('/tides') }}" label="Tides" icon="waves"/>
          <x-nav-link href="{{ url('/alerts') }}" label="Alerts & Guides" icon="bell"/>
        </nav>
      </aside>
    </div>

    <!-- Main -->
    <main class="col-span-12 sm:col-span-9 lg:col-span-10">
      @yield('content')
    </main>
  </div>

  <footer class="py-8 text-center text-xs text-slate-500">
    © {{ now('Asia/Manila')->year }} TyphoGuard · Prototype
  </footer>

</body>
</html>
