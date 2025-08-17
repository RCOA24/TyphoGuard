// weather.js

// Map Open-Meteo weather codes to labels/colors/icons/severity
const weatherCodeMap = {
  0: { label: "Clear", color: "#FFD700", icon: "☀️", severity: 1 },
  1: { label: "Mainly clear", color: "#FFE08A", icon: "🌤️", severity: 1 },
  2: { label: "Partly cloudy", color: "#C0C0C0", icon: "⛅", severity: 1 },
  3: { label: "Overcast", color: "#808080", icon: "☁️", severity: 1 },
  45: { label: "Fog", color: "#A9A9A9", icon: "🌫️", severity: 1 },
  48: { label: "Depositing rime fog", color: "#B0B0B0", icon: "🌁", severity: 1 },
  51: { label: "Drizzle: Light", color: "#7EC8E3", icon: "☔", severity: 2 },
  53: { label: "Drizzle: Moderate", color: "#5AA6CF", icon: "🌧️", severity: 2 },
  55: { label: "Drizzle: Dense", color: "#2B82C2", icon: "🌧️", severity: 3 },
  61: { label: "Rain: Slight", color: "#3399FF", icon: "🌧️", severity: 2 },
  63: { label: "Rain: Moderate", color: "#007ACC", icon: "🌧️", severity: 3 },
  65: { label: "Rain: Heavy", color: "#005FA3", icon: "🌧️", severity: 4 },
  80: { label: "Rain showers: Slight", color: "#66CCFF", icon: "🌦️", severity: 2 },
  81: { label: "Rain showers: Moderate", color: "#3399FF", icon: "☔", severity: 3 },
  82: { label: "Rain showers: Violent", color: "#0066CC", icon: "🌧️", severity: 4 },
  95: { label: "Thunderstorm", color: "#e74242ff", icon: "⛈️", severity: 5 }
};

async function fetchWeather() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=13.4088&longitude=122.5615&timezone=auto&daily=weather_code`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    renderWeatherChart(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function renderWeatherChart(data) {
  const ctx = document.getElementById('weather-chart').getContext('2d');
  const dates = data.daily.time;
  const codes = data.daily.weather_code;

  const colors = codes.map(code => weatherCodeMap[code]?.color || "#999999");
  const severities = codes.map(code => weatherCodeMap[code]?.severity || 1);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dates,
      datasets: [{
        label: 'Weather Severity',
        data: severities, // bar height = severity
        backgroundColor: colors
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              const code = codes[context.dataIndex];
              const info = weatherCodeMap[code];
              return info ? `${info.label} (${code})` : `Unknown (${code})`;
            }
          }
        },
        legend: { display: false }
      },
      scales: {
        y: {
          display: false
        }
      }
    },
    plugins: [{
      id: 'weatherIcons',
      afterDatasetsDraw(chart) {
        const {ctx, data, chartArea: {top, bottom}, scales: {x, y}} = chart;
        data.datasets[0].data.forEach((value, index) => {
          const code = codes[index];
          const icon = weatherCodeMap[code]?.icon || "";
          const xPos = x.getPixelForTick(index);
          const yPos = y.getPixelForValue(value) + 20; // icon above bar
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(icon, xPos, yPos);
        });
      }
    }]
  });
}

// Call the function
fetchWeather();
