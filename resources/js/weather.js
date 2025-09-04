import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Draggable);

const weatherCodeMap = {
  0: { label: "Clear", color: "#FFD700", icon: "☀️" },
  1: { label: "Clear", color: "#FFE08A", icon: "🌤️" },
  2: { label: "Partly Cloudy", color: "#C0C0C0", icon: "⛅" },
  3: { label: "Overcast", color: "#808080", icon: "☁️" },
  45: { label: "Foggy", color: "#A9A9A9", icon: "🌫️" },
  48: { label: "Foggy", color: "#B0B0B0", icon: "🌫️" },
  51: { label: "Light Drizzle", color: "#7EC8E3", icon: "🌦️" },
  53: { label: "Drizzle", color: "#5AA6CF", icon: "🌧️" },
  55: { label: "Heavy Drizzle", color: "#2B82C2", icon: "🌧️" },
  61: { label: "Light Rain", color: "#3399FF", icon: "🌧️" },
  63: { label: "Rain", color: "#007ACC", icon: "🌧️" },
  65: { label: "Heavy Rain", color: "#005FA3", icon: "⛈️" },
  66: { label: "Freezing Rain", color: "#4169E1", icon: "🌧️" },
  67: { label: "Heavy Freezing", color: "#0000CD", icon: "⛈️" },
  71: { label: "Light Snow", color: "#E0FFFF", icon: "🌨️" },
  73: { label: "Snow", color: "#B0E0E6", icon: "🌨️" },
  75: { label: "Heavy Snow", color: "#87CEEB", icon: "🌨️" },
  77: { label: "Snow", color: "#B0C4DE", icon: "🌨️" },
  80: { label: "Light Showers", color: "#66CCFF", icon: "🌦️" },
  81: { label: "Rain Showers", color: "#3399FF", icon: "🌧️" },
  82: { label: "Heavy Showers", color: "#0066CC", icon: "⛈️" },
  85: { label: "Snow Shower", color: "#E0FFFF", icon: "🌨️" },
  86: { label: "Heavy Snow", color: "#B0E0E6", icon: "🌨️" },
  95: { label: "Thunderstorm", color: "#e74242ff", icon: "🌩️" },
  96: { label: "Storm & Hail", color: "#8B0000", icon: "⛈️" },
  99: { label: "Severe Storm", color: "#800000", icon: "⛈️" }
};

const CACHE_KEY = 'weatherData';
const LOCATION_CACHE_KEY = 'userLocation';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const LOCATION_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Default Manila coordinates
const DEFAULT_COORDS = {
  latitude: 14.5995,
  longitude: 120.9842,
  name: 'Manila'
};

async function getUserLocation() {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });

    const coords = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };

    // Get location name using reverse geocoding
    try {
      const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();
      
      coords.name = geoData.address.city || 
                    geoData.address.municipality || 
                    geoData.address.town ||
                    'Your location';
    } catch (error) {
      coords.name = 'Your location';
    }

    return coords;
  } catch (error) {
    console.log('Location access denied:', error);
    throw error;
  }
}

async function createLocationButton(container, onLocationUpdate) {
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex items-center gap-2 mb-4 ml-2';
  
  const locationText = document.createElement('div');
  locationText.className = 'text-sm text-gray-600 dark:text-gray-400';
  locationText.textContent = `Weather forecast for ${DEFAULT_COORDS.name}`;

  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'flex gap-2';

  // Use my location button
  const button = document.createElement('button');
  button.className = 'px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center gap-1 transition-colors';
  button.innerHTML = `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
    Use my location
  `;

  // Refresh button
  const refreshButton = document.createElement('button');
  refreshButton.className = 'px-3 py-1 text-sm bg-slate-500 hover:bg-slate-600 text-white rounded-full flex items-center gap-1 transition-colors';
  refreshButton.innerHTML = `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
    Reset to Manila
  `;

  let isUpdating = false;

  button.addEventListener('click', async () => {
    if (isUpdating) return;
    
    try {
      isUpdating = true;
      button.classList.add('opacity-50');
      button.innerHTML = `
        <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Updating...
      `;
      
      const location = await getUserLocation();
      locationText.textContent = `Weather forecast for ${location.name}`;
      await onLocationUpdate(location, true); // force refresh
      
      button.innerHTML = `
        <svg class="w-4 h-4 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        Location updated
      `;
      
      setTimeout(() => {
        button.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Use my location
        `;
      }, 2000);

    } catch (error) {
      button.innerHTML = `
        <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Location access denied
      `;
      setTimeout(() => {
        button.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Use my location
        `;
      }, 3000);
    } finally {
      isUpdating = false;
      button.classList.remove('opacity-50');
    }
  });

  refreshButton.addEventListener('click', async () => {
    locationText.textContent = `Weather forecast for ${DEFAULT_COORDS.name}`;
    await onLocationUpdate(DEFAULT_COORDS, true); // force refresh
  });

  buttonGroup.appendChild(button);
  buttonGroup.appendChild(refreshButton);
  buttonContainer.appendChild(locationText);
  buttonContainer.appendChild(buttonGroup);
  container.parentElement.insertBefore(buttonContainer, container);

  return { locationText, button, refreshButton };
}

async function loadWeatherCards() {
  const container = document.getElementById('weather-cards-container');
  if (!container) return;

  const { locationText } = await createLocationButton(container, async (newLocation, forceRefresh = false) => {
    container.innerHTML = '<div class="text-center w-full py-4">Updating weather data...</div>';
    await loadWeatherData(container, newLocation, forceRefresh);
  });

  // Initial load with Manila
  container.innerHTML = '<div class="text-center w-full py-4">Loading weather data...</div>';
  await loadWeatherData(container, DEFAULT_COORDS, true);
}

async function loadWeatherData(container, location, forceRefresh = false) {
  // Reset any existing GSAP animations
  gsap.killTweensOf("#weather-cards-container > div");
  
  // Add consistent spacing and sizing to container
  container.style.gap = '0.75rem';
  container.style.padding = '0 0.75rem';
  
  // Add scrollbar and touch scrolling styling
  const scrollContainer = container.parentElement;
  if (scrollContainer) {
    scrollContainer.classList.add('custom-scrollbar');
    scrollContainer.style.scrollbarGutter = 'stable';
    scrollContainer.style.overscrollBehaviorX = 'contain';
    scrollContainer.style.WebkitOverflowScrolling = 'touch';
    
    // Handle wheel events for smooth horizontal scrolling
    scrollContainer.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
      }
    }, { passive: false });

    // Separate mouse and touch handling
    let isMouseDown = false;
    let startX;
    let scrollLeft;
    let lastMouseX;
    let mouseVelocity = 0;
    let mouseAnimationFrame;

    // Mouse handling for desktop
    if (window.matchMedia('(pointer: fine)').matches) {
      scrollContainer.style.cursor = 'grab';

      scrollContainer.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        scrollContainer.style.cursor = 'grabbing';
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
        lastMouseX = e.pageX;
        cancelAnimationFrame(mouseAnimationFrame);
      });

      scrollContainer.addEventListener('mouseleave', () => {
        isMouseDown = false;
        scrollContainer.style.cursor = 'grab';
      });

      scrollContainer.addEventListener('mouseup', () => {
        isMouseDown = false;
        scrollContainer.style.cursor = 'grab';
        
        if (Math.abs(mouseVelocity) > 1) {
          const startVelocity = mouseVelocity * 0.8;
          const animate = () => {
            if (Math.abs(mouseVelocity) < 0.1) {
              mouseVelocity = 0;
              return;
            }
            scrollContainer.scrollLeft += mouseVelocity;
            mouseVelocity *= 0.95;
            mouseAnimationFrame = requestAnimationFrame(animate);
          };
          mouseVelocity = startVelocity;
          animate();
        }
      });

      scrollContainer.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
        e.preventDefault();
        
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollContainer.scrollLeft = scrollLeft - walk;
        
        mouseVelocity = lastMouseX - e.pageX;
        lastMouseX = e.pageX;
      });
    }

    // Touch handling for mobile devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      let touchStartX;
      let touchScrollLeft;
      
      scrollContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].pageX;
        touchScrollLeft = scrollContainer.scrollLeft;
        cancelAnimationFrame(mouseAnimationFrame);
      }, { passive: true });

      scrollContainer.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const walkX = (touchStartX - touch.pageX);
        scrollContainer.scrollLeft = touchScrollLeft + walkX;
      }, { passive: true });
    }
  }

  const locationKey = `${CACHE_KEY}_${location.latitude}_${location.longitude}`;
  const cached = JSON.parse(sessionStorage.getItem(locationKey) || 'null');
  const now = Date.now();
  let data;

  if (!forceRefresh && cached && now - cached.timestamp < CACHE_TTL) {
    data = cached.data;
  } else {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&timezone=Asia/Manila&daily=weather_code,temperature_2m_max,temperature_2m_min,rain_sum,windspeed_10m_max&hourly=temperature_2m,weather_code`;
      const res = await fetch(url);
      data = await res.json();
      sessionStorage.setItem(locationKey, JSON.stringify({ data, timestamp: now }));
    } catch (err) {
      console.error('Weather API failed:', err);
      container.innerHTML = '<div class="text-center w-full py-4 text-red-500">Failed to load weather data</div>';
      return;
    }
  }

  container.innerHTML = '';

  data.daily.time.forEach((dateStr, idx) => {
    const code = data.daily.weather_code[idx];
    const weather = weatherCodeMap[code] || { label: 'Unknown', color: '#ccc', icon: '❓' };
    const maxTemp = data.daily.temperature_2m_max[idx];
    const minTemp = data.daily.temperature_2m_min[idx];
    const rain = data.daily.rain_sum[idx];
    const wind = data.daily.windspeed_10m_max[idx];

    const card = document.createElement('div');
    card.className = `
      bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex flex-col items-center text-center
      w-[140px] min-w-[140px] max-w-[140px]
      cursor-pointer snap-center
      active:scale-95 transform
    `;
    card.style.borderTop = `4px solid ${weather.color}`;
    
    // Get the hourly data for this day
    const dayStart = new Date(dateStr);
    const nextDay = new Date(dateStr);
    nextDay.setDate(nextDay.getDate() + 1);
    
    // Find the most severe weather for the day
    const dayHourlyIndices = data.hourly.time.reduce((acc, time, index) => {
      const timeDate = new Date(time);
      if (timeDate >= dayStart && timeDate < nextDay) {
        acc.push(index);
      }
      return acc;
    }, []);

    // Get weather conditions for each part of the day
    const getPeriodWeather = (startHour, endHour) => {
      const periodIndices = dayHourlyIndices.filter(index => {
        const hour = new Date(data.hourly.time[index]).getHours();
        return hour >= startHour && hour < endHour;
      });
      
      if (periodIndices.length === 0) return null;

      const codes = periodIndices.map(index => data.hourly.weather_code[index]);
      const mostSevereCode = Math.max(...codes); // Higher codes usually mean more severe weather
      return weatherCodeMap[mostSevereCode] || null;
    };

    const morningWeather = getPeriodWeather(5, 12);
    const afternoonWeather = getPeriodWeather(12, 18);
    const eveningWeather = getPeriodWeather(18, 24);

    card.innerHTML = `
      <div class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-300 mb-1 truncate">
        ${new Date(dateStr).toLocaleDateString('en-PH', { weekday:'short', month:'short', day:'numeric' })}
      </div>
      <div class="text-3xl sm:text-4xl mb-1">${weather.icon}</div>
      <div class="text-sm sm:text-base font-medium mb-1 truncate max-w-[120px] mx-auto">${weather.label}</div>
      <div class="text-sm mb-1">🌡️ ${maxTemp.toFixed(0)}° / ${minTemp.toFixed(0)}°C</div>
      
      <div class="text-xs mb-2 text-gray-600 dark:text-gray-400">
        ${morningWeather ? `☀️ 5am-12pm: ${morningWeather.label}` : ''}
        <br>
        ${afternoonWeather ? `<br>🌅 12pm-6pm: ${afternoonWeather.label}` : ''}
        <br>
        ${eveningWeather ? `<br>🌙 6pm-12am: ${eveningWeather.label}` : ''}
      </div>
      
      <div class="text-sm mb-1">🌧️ ${rain.toFixed(1)} mm</div>
      <br>
      <div class="text-sm">💨 ${wind.toFixed(0)} km/h</div>
    `;
    container.appendChild(card);
  });

  // Set initial state for cards
  gsap.set("#weather-cards-container > div", {
    opacity: 0,
    y: 30,
    scale: 0.8
  });

  // GSAP animation
  gsap.to("#weather-cards-container > div", {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.6,
    stagger: 0.1,
    ease: "back.out(1.2)",
    scrollTrigger: {
      trigger: "#weather-cards-container",
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });

  // Add hover animation
  const cards = container.querySelectorAll('div');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.05,
        duration: 0.2,
        ease: "power1.out"
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        duration: 0.2,
        ease: "power1.out"
      });
    });
  });
}

// Lazy load
const el = document.getElementById('weather-cards-container');
if (el) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadWeatherCards();
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.1 });
  observer.observe(el);
}