// weather.js

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

function aggregateRainToDaily(hourlyTime, hourlyRain) {
  const dailyTotals = {};
  hourlyTime.forEach((t, i) => {
    const day = new Date(t).toISOString().split('T')[0];
    if (!dailyTotals[day]) dailyTotals[day] = 0;
    dailyTotals[day] += hourlyRain[i];
  });
  return Object.values(dailyTotals);
}

async function fetchWeather() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=13.4088&longitude=122.5615&timezone=auto&daily=weather_code,temperature_2m_max,temperature_2m_min,windspeed_10m_max&hourly=rain`;
  const res = await fetch(url);
  const data = await res.json();

  const dailyRain = aggregateRainToDaily(data.hourly.time, data.hourly.rain);
  renderWeatherChart(data, dailyRain);
}

function renderWeatherChart(data, dailyRain) {
  const ctx = document.getElementById('weather-chart').getContext('2d');
  const dailyDates = data.daily.time;
  const codes = data.daily.weather_code;
  const severities = codes.map(c => weatherCodeMap[c]?.severity || 1);
  const maxTemps = data.daily.temperature_2m_max;
  const minTemps = data.daily.temperature_2m_min;
  const windSpeeds = data.daily.windspeed_10m_max;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dailyDates.map(d =>
        new Date(d).toLocaleDateString('en-PH', { weekday:'short', month:'short', day:'numeric' })
      ),
      datasets: [
        { label: 'Weather Severity', data: severities, borderColor: '#FFA500', backgroundColor: 'rgba(255,165,0,0.2)', fill: true, tension: 0.3 },
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
              return `${datasetLabel}: ${context.raw.toFixed(1)} ${datasetLabel.includes('Temp') ? '°C' : datasetLabel.includes('Wind') ? 'km/h' : 'mm'}`;
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

fetchWeather();
