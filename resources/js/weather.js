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
const CACHE_TTL = 10 * 60 * 1000;

async function loadWeatherCards() {
  const container = document.getElementById('weather-cards-container');
  if (!container) return;

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

  const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
  const now = Date.now();
  let data;

  if (cached && now - cached.timestamp < CACHE_TTL) {
    data = cached.data;
  } else {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=13.4088&longitude=122.5615&timezone=auto&daily=weather_code,temperature_2m_max,temperature_2m_min,rain_sum,windspeed_10m_max`;
      const res = await fetch(url);
      data = await res.json();
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: now }));
    } catch (err) {
      console.error('Weather API failed:', err);
      return;
    }
  }

  container.innerHTML = '';

  data.daily.time.forEach((dateStr, idx) => {
    const code = data.daily.weather_code[idx];
    console.log(`Date: ${dateStr}, Weather Code: ${code}`);
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
    card.innerHTML = `
      <div class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-300 mb-1 truncate">
        ${new Date(dateStr).toLocaleDateString('en-PH', { weekday:'short', month:'short', day:'numeric' })}
      </div>
      <div class="text-3xl sm:text-4xl mb-1">${weather.icon}</div>
      <div class="text-sm sm:text-base font-medium mb-1 truncate max-w-[120px] mx-auto">${weather.label}</div>
      <div class="text-sm mb-1">🌡️ ${maxTemp.toFixed(0)}° / ${minTemp.toFixed(0)}°C</div>
      <div class="text-sm mb-1">🌧️ ${rain.toFixed(1)} mm</div>
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
