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
    <div class="hero-content">
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

  <!-- Personal Story Section -->
  <div class="cardtyphoon rounded-2xl personal-story">
    <div class="cardtyphoon-body">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <!-- Profile Image -->
        <div class="lg:col-span-1 flex justify-center">
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
            <div class="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-xl">
              <!-- Replace this src with your actual photo path -->
              <img src="{{ asset('images/profile.jpg') }}" 
                   alt="Charles Austria - TyphoGuard Developer" 
                   class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                   onerror="console.log('Image failed to load:', this.src); this.style.display='none'; this.nextElementSibling.style.display='flex';"
                   onload="console.log('Image loaded successfully:', this.src);">
              <!-- Fallback avatar if image doesn't load -->
              <div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-6xl font-bold" style="display: none;">
                CA
              </div>
            </div>
          </div>
        </div>
        
        <!-- Personal Story Content -->
        <div class="lg:col-span-2 space-y-6">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold mb-2">
              Beyond Code: <span class="text-gradient">A Personal Mission</span>
            </h2>
            <p class="text-lg text-slate-500 dark:text-slate-400 font-medium">
              Rodney Charles O. Austria - Developer & Filipino Citizen
            </p>
          </div>
          
          <div class="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
            <p class="text-lg">
              Growing up in the Philippines means living with the reality of typhoons. I've experienced the anxiety of watching weather updates, the frustration of conflicting information, and the helplessness when communities lack early warning systems.
            </p>
            
            <p>
              As a developer, I realized I had the skills to bridge this gap. TyphoGuard isn't just another portfolio project—it's my response to a problem that affects millions of Filipinos every year. Every feature, from dam level monitoring to localized emergency guides, comes from real experiences and genuine concern for community safety.
            </p>
            
            <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border-l-4 border-blue-500">
              <p class="text-slate-700 dark:text-slate-200 italic">
                "Technology should serve our most pressing needs. When I see families evacuating due to sudden dam releases or communities caught off-guard by flash floods, I'm reminded why projects like TyphoGuard matter. It's not about showing off technical skills—it's about using those skills for something meaningful."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mission Statement -->
  <div class="cardtyphoon rounded-2xl">
    <div class="cardtyphoon-body text-center mission-content">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Technology That <span class="text-gradient">Saves Lives</span></h2>
      <p class="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
        In a country where typhoons and flooding threaten millions, we don't just build apps—we build hope. TyphoGuard transforms complex environmental data into actionable intelligence that communities can trust.
      </p>
    </div>
  </div>

  <!-- Developer Journey Section -->
  <div class="cardtyphoon rounded-2xl developer-journey">
    <div class="cardtyphoon-head">
      <h3 class="text-2xl font-bold">From Problem to Solution</h3>
    </div>
    <div class="cardtyphoon-body">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center space-y-3">
          <div class="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h4 class="font-bold text-lg">The Problem</h4>
          <p class="text-sm text-slate-600 dark:text-slate-300">
            Scattered weather information, delayed dam release warnings, and generic apps that don't understand Filipino community needs.
          </p>
        </div>
        
        <div class="text-center space-y-3">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <h4 class="font-bold text-lg">The Insight</h4>
          <p class="text-sm text-slate-600 dark:text-slate-300">
            Filipinos need hyper-local, actionable weather intelligence—especially around dam operations and community-specific risks.
          </p>
        </div>
        
        <div class="text-center space-y-3">
          <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h4 class="font-bold text-lg">The Solution</h4>
          <p class="text-sm text-slate-600 dark:text-slate-300">
            A comprehensive platform combining real-time data, predictive intelligence, and community-first design principles.
          </p>
        </div>
      </div>
      
      <div class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-xl">
        <h4 class="font-bold text-lg mb-3 text-center">Community-Driven Development</h4>
        <p class="text-slate-600 dark:text-slate-300 text-center">
          Every feature in TyphoGuard addresses real Filipino experiences with weather emergencies. This isn't theoretical—it's practical technology born from genuine community need and developer passion for social impact.
        </p>
      </div>
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
    

    <!-- Feature 2: Tide Monitoring -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
  <!-- Tide Feature Description -->
  <div class="feature-card opacity-0 order-1 lg:order-2">
    <div class="cardtyphoon rounded-2xl">
      <div class="cardtyphoon-body">
        <div class="feature-icon w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-r from-blue-500 to-sky-400">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" 
                d="M3 15c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0 3.5 1.5 5 0M3 9c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0 3.5 1.5 5 0"/>
        </svg>
        </div>
        <h3 class="text-xl font-bold mb-3">Tide Monitoring</h3>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
          TyphoGuard provides real-time tide information with <strong>123 tide stations</strong> across <strong>23 regions of the Philippines</strong>.  
          Users can check the <strong>next high tide, next low tide, and tidal ranges</strong>, or use their current location to get personalized updates.  
          More improvements are continuously being added to expand coverage and accuracy.
        </p>
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
            <h3 class="text-xl font-bold mb-3">Localized Weather Insights</h3>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
              Unlike generic apps, TyphoGuard focuses on what matters to Filipinos—real-time radar, detailed forecasts, and location-specific updates. Whether you're in Manila or checking conditions near you, TyphoGuard delivers accurate, timely weather data tailored for the Philippines.
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
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=rodneycharlesaustria1124@gmail.com" 
          target="_blank" 
          rel="noopener noreferrer"
          class="relative inline-flex items-center justify-center px-8 py-3.5 
                  bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold 
                  rounded-xl shadow-lg overflow-hidden group">
          
          <!-- Shimmer Effect -->
          <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent 
                      translate-x-[-100%] animate-shimmer opacity-0"></span>
          
          <!-- Button Content -->
          <span class="relative flex items-center gap-2">
            Get Started
            
          </span>
        </a>
      </div>
  
    </div>
  </div>
</div>
@endsection