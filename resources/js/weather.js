const weatherCodeMap = {
  0: { label: "Clear", color: "#FFD700", severity: 1 },
  1: { label: "Mainly clear", color: "#FFE08A", severity: 1 },
  2: { label: "Partly cloudy", color: "#C0C0C0", severity: 1 },
  3: { label: "Overcast", color: "#808080", severity: 1 },
  45: { label: "Fog", color: "#A9A9A9", severity: 1 },
  48: { label: "Depositing rime fog", color: "#B0B0B0", severity: 1 },
  51: { label: "Drizzle: Light", color: "#7EC8E3", severity: 2 },
  53: { label: "Drizzle: Moderate", color: "#5AA6CF", severity: 2 },
  55: { label: "Drizzle: Dense", color: "#2B82C2", severity: 3 },
  61: { label: "Rain: Slight", color: "#3399FF", severity: 2 },
  63: { label: "Rain: Moderate", color: "#007ACC", severity: 3 },
  65: { label: "Rain: Heavy", color: "#005FA3", severity: 4 },
  80: { label: "Rain showers: Slight", color: "#66CCFF", severity: 2 },
  81: { label: "Rain showers: Moderate", color: "#3399FF", severity: 3 },
  82: { label: "Rain showers: Violent", color: "#0066CC", severity: 4 },
  95: { label: "Thunderstorm", color: "#e74242ff", severity: 5 }
};

let weatherChart = null;
const CACHE_KEY = 'weatherData';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function lazyLoadWeatherChart() {
  const el = document.getElementById('weather-chart');
  if (!el) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadWeatherData();
        obs.unobserve(el); // Stop observing
      }
    });
  }, { threshold: 0.1 });

  observer.observe(el);
}

// Load weather either from cache or API
async function loadWeatherData() {
  const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL) {
    renderWeatherChart(cached.data);
    return;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=13.4088&longitude=122.5615&timezone=auto&daily=weather_code,temperature_2m_max,temperature_2m_min,rain_sum,windspeed_10m_max`;
    const res = await fetch(url);
    const data = await res.json();

    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: now }));
    renderWeatherChart(data);
  } catch (err) {
    console.error('Weather API failed:', err);
  }
}

function renderWeatherChart(data) {
  const ctx = document.getElementById('weather-chart').getContext('2d');

  const dailyDates = data.daily.time.map(d =>
    new Date(d).toLocaleDateString('en-PH', { weekday:'short', month:'short', day:'numeric' })
  );
  const weatherSeverities = data.daily.weather_code.map(c => weatherCodeMap[c]?.severity || 1);
  const dailyRain = data.daily.rain_sum;
  const maxTemps = data.daily.temperature_2m_max;
  const minTemps = data.daily.temperature_2m_min;
  const windSpeeds = data.daily.windspeed_10m_max;

  if (weatherChart) weatherChart.destroy();

  weatherChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dailyDates,
      datasets: [
        { label: 'Weather Severity', data: weatherSeverities, borderColor: '#FFA500', backgroundColor: 'rgba(255,165,0,0.2)', fill: true, tension: 0.3 },
        { label: 'Daily Rain (mm)', data: dailyRain, borderColor: '#00BFFF', backgroundColor: 'rgba(0,191,255,0.2)', fill: true, tension: 0.3 },
        { label: 'Max Temp (°C)', data: maxTemps, borderColor: '#FF4500', fill: false, tension: 0.3 },
        { label: 'Min Temp (°C)', data: minTemps, borderColor: '#1E90FF', fill: false, tension: 0.3 },
        { label: 'Max Wind Speed (km/h)', data: windSpeeds, borderColor: '#32CD32', fill: false, tension: 0.3 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 0 },
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              const datasetLabel = context.dataset.label;
              return `${datasetLabel}: ${context.raw.toFixed(1)} ${
                datasetLabel.includes('Temp') ? '°C' :
                datasetLabel.includes('Wind') ? 'km/h' : 'mm'
              }`;
            }
          }
        },
        legend: { display: true }
      },
      scales: {
        x: { ticks: { autoSkip: false } },
        y: { beginAtZero: true, title: { display: true, text: 'Severity / Rain / Temp / Wind' } }
      }
    }
  });
}

// Initialize lazy loading
lazyLoadWeatherChart();
