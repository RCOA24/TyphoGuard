@extends('layouts.app')

@section('content')
<div class="space-y-8 overflow-hidden pr-2">
<!-- Add about.css stylesheet -->
<link rel="stylesheet" href="{{ asset('css/about.css') }}">
  
 <!-- Hero Section -->
<div class="relative cardtyphoon rounded-2xl overflow-hidden hero-gradient min-h-[500px] flex items-center justify-center">
  <!-- Floating Background Elements -->
  <div class="absolute inset-0 overflow-hidden opacity-20">
    <div class="floating-element absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
    <div class="floating-element absolute top-20 right-16 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
    <div class="floating-element absolute bottom-16 left-1/4 w-24 h-24 bg-pink-500/20 rounded-full blur-xl"></div>
  </div>

  <!-- Animated Typhoon Background -->
  <div class="absolute inset-0 typhoon-animation">
    <div class="typhoon-eye"></div>
    <div class="typhoon-spiral"></div>

    <!-- Water drops scattered -->
    <div class="water-drop" style="left: 5%; animation-delay: 0s;"></div>
    <div class="water-drop" style="left: 15%; animation-delay: 0.3s;"></div>
    <div class="water-drop" style="left: 25%; animation-delay: 0.6s;"></div>
    <div class="water-drop" style="left: 35%; animation-delay: 0.9s;"></div>
    <div class="water-drop" style="left: 45%; animation-delay: 1.2s;"></div>
    <div class="water-drop" style="left: 55%; animation-delay: 1.5s;"></div>
    <div class="water-drop" style="left: 65%; animation-delay: 1.8s;"></div>
    <div class="water-drop" style="left: 75%; animation-delay: 2.1s;"></div>
    <div class="water-drop" style="left: 85%; animation-delay: 2.4s;"></div>
    <div class="water-drop" style="left: 95%; animation-delay: 2.7s;"></div>
  </div>

  <!-- Hero Content -->
  <div class="relative z-10 p-8 text-center max-w-3xl">
    <div class="opacity-0 hero-content">
      <h1 class="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
        <span class="text-gradient">TyphoGuard</span>
      </h1>
      <p class="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed">
        Where technology meets climate resilience. Transforming weather data into life-saving intelligence for Philippine communities.
      </p>
      <div class="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Real-time Monitoring</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Dam Intelligence</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span>Community-First</span>
        </div>
      </div>
    </div>
  </div>
</div>

  <!-- Mission Statement -->
  <div class="cardtyphoon rounded-2xl">
    <div class="cardtyphoon-body text-center mission-content opacity-0">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Technology That <span class="text-gradient">Saves Lives</span></h2>
      <p class="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
        In a country where typhoons and flooding threaten millions, we don't just build apps—we build hope. TyphoGuard transforms complex environmental data into actionable intelligence that communities can trust.
      </p>
    </div>
  </div>

  <!-- Impact Stats -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 stats-container opacity-0">
    <div class="cardtyphoon rounded-2xl transform hover:scale-105 transition-all duration-300">
      <div class="cardtyphoon-body text-center">
        <div class="text-3xl md:text-4xl font-bold text-gradient mb-2 stat-counter" data-target="20">0</div>
        <p class="text-slate-500 dark:text-slate-400 font-medium">Typhoons annually</p>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Affecting Philippine regions</p>
      </div>
    </div>
    <div class="cardtyphoon rounded-2xl transform hover:scale-105 transition-all duration-300">
      <div class="cardtyphoon-body text-center">
        <div class="text-3xl md:text-4xl font-bold text-gradient mb-2 stat-counter" data-target="100">0</div>
        <p class="text-slate-500 dark:text-slate-400 font-medium">Million people at risk</p>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">In flood-prone areas</p>
      </div>
    </div>
    <div class="cardtyphoon rounded-2xl transform hover:scale-105 transition-all duration-300">
      <div class="cardtyphoon-body text-center">
        <div class="text-3xl md:text-4xl font-bold text-gradient mb-2 stat-counter" data-target="24">0</div>
        <p class="text-slate-500 dark:text-slate-400 font-medium">Hours early warning</p>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Can save thousands of lives</p>
      </div>
    </div>
  </div>

  <!-- Key Features -->
  <div class="space-y-8">
    <h2 class="text-3xl md:text-4xl font-bold text-center features-title opacity-0">
      Beyond Weather Forecasts
    </h2>
    
    <!-- Feature 1: Dam Intelligence -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div class="feature-card opacity-0">
        <div class="cardtyphoon rounded-2xl">
          <div class="cardtyphoon-body">
            <div class="feature-icon w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3">Dam Control Awareness</h3>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
              The game-changer others miss. Real-time dam level monitoring with overflow predictions helps communities prepare for controlled releases before they happen—turning potential disasters into manageable events.
            </p>
          </div>
        </div>
      </div>
      
      <div class="dam-visual opacity-0">
        <div class="cardtyphoon rounded-2xl">
          <div class="cardtyphoon-body">
            <h4 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Dam Water Levels</h4>
            <div class="flex items-end justify-center space-x-6 h-38">
              <div class="flex flex-col items-center">
                <div class="w-12 h-24 bg-slate-200 dark:bg-slate-700 rounded-t-lg relative overflow-hidden">
                  <div class="dam-water absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-green-400 transition-all duration-2000" style="height: 60%;"></div>
                </div>
                <span class="badge-ok mt-2">Normal</span>
              </div>
              <div class="flex flex-col items-center">
                <div class="w-12 h-24 bg-slate-200 dark:bg-slate-700 rounded-t-lg relative overflow-hidden">
                  <div class="dam-water absolute bottom-0 w-full bg-gradient-to-t from-amber-500 to-amber-400 transition-all duration-2000" style="height: 85%;"></div>
                </div>
                <span class="badge-warn mt-2">Warning</span>
              </div>
              <div class="flex flex-col items-center">
                <div class="w-12 h-24 bg-slate-200 dark:bg-slate-700 rounded-t-lg relative overflow-hidden">
                  <div class="dam-water absolute bottom-0 w-full bg-gradient-to-t from-red-500 to-red-400 transition-all duration-2000 animate-pulse-glow" style="height: 95%;"></div>
                </div>
                <span class="badge-danger mt-2">Critical</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Feature 2: Local Relevance -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div class="local-visual opacity-0 order-2 lg:order-1">
        <div class="cardtyphoon rounded-2xl">
          <div class="cardtyphoon-body">
            <div class="mb-4">
              <div class="flex items-center space-x-2 mb-2">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-sm font-medium">Region IV-A (CALABARZON)</span>
              </div>
              <div class="text-xl font-bold">Metro Manila</div>
              <div class="text-sm text-slate-500 dark:text-slate-400">Emergency Protocols Active</div>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center space-x-3 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span class="text-sm">Evacuation Centers: 15 active</span>
              </div>
              <div class="flex items-center space-x-3 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span class="text-sm">Emergency Hotline: 117</span>
              </div>
              <div class="flex items-center space-x-3 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                <div class="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span class="text-sm">Safe Routes: Updated 2m ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
     
      <div class="feature-card opacity-0 order-1 lg:order-2">
        <div class="cardtyphoon rounded-2xl">
          <div class="cardtyphoon-body">
            <div class="feature-icon w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3">Hyper-Local Intelligence</h3>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
              Generic weather apps don't understand Manila's unique flooding patterns or know Cebu's evacuation routes. TyphoGuard is built for Filipino communities, with region-specific protocols, shelter networks, and cultural context.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Vision Statement -->
  <div class="cardtyphoon rounded-2xl vision-content opacity-0">
    <div class="cardtyphoon-body text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-6">
        More Than A <span class="text-gradient">Portfolio Piece</span>
      </h2>
      <div class="text-lg text-slate-600 dark:text-slate-300 leading-relaxed space-y-4 max-w-3xl mx-auto">
        <p>
          TyphoGuard represents a fundamental belief: technology should serve humanity's greatest challenges, not just convenience. Every line of code, every interface decision, every data visualization serves one purpose—keeping communities safe.
        </p>
        <p>
          This isn't about building another weather app. It's about demonstrating how thoughtful engineering, user-centered design, and deep local understanding can create solutions that truly matter. It's about tech for good that goes beyond buzzwords.
        </p>
        <p class="text-xl font-semibold text-gradient">
          Climate resilience starts with the right information, at the right time, in the right hands.
        </p>
      </div>
    </div>
  </div>

  <!-- Emergency Guides Integration -->
  <div class="cardtyphoon rounded-2xl emergency-guides opacity-0">
    <div class="cardtyphoon-head">
      <h3 class="text-lg font-semibold">Localized Emergency Guides (Prototype)</h3>
    </div>
    <div class="cardtyphoon-body">
      <p class="text-slate-600 dark:text-slate-300 mb-4">
        Tailor content per region: shelters, hotlines, and evacuation routes.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <h4 class="font-medium text-green-600 dark:text-green-400 mb-2">Before Heavy Rain</h4>
          <ul class="text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <li>• Prepare go-bag</li>
            <li>• Check dam advisories</li>
            <li>• Avoid low-lying routes</li>
          </ul>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <h4 class="font-medium text-amber-600 dark:text-amber-400 mb-2">During Flood Watch</h4>
          <ul class="text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <li>• Move valuables up</li>
            <li>• Charge devices</li>
            <li>• Inform family of meetup points</li>
          </ul>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <h4 class="font-medium text-red-600 dark:text-red-400 mb-2">During Releases/Overflow</h4>
          <ul class="text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <li>• Follow LGU directives immediately</li>
            <li>• Keep away from riverbanks</li>
            <li>• Monitor official channels</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Call to Action -->
  <div class="cardtyphoon rounded-2xl cta-content opacity-0">
    <div class="cardtyphoon-body text-center">
      <h3 class="text-2xl font-bold mb-4">Building the Future of Climate Tech</h3>
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">
        Ready to create technology that matters? Let's discuss how data-driven solutions can serve communities and drive positive impact.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="https://www.facebook.com/charles.austria.56" class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition">
          Get Started
        </a>
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=rodneycharlesaustria1124@gmail.com" class="inline-flex items-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition">
          Email me
        </a>
      </div>
    </div>
  </div>
</div>
@endsection
