let tideChartFull;

// Fetch tide data from Open-Meteo API
window.loadTideData = async function(lat, lon) {
    try {
        const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height&timezone=auto`;
        const response = await fetch(url);
        const data = await response.json();

        // Call UI + chart updates
        if (typeof updateTideUI === "function") {
            updateTideUI(data);
        }
        if (typeof updateTideChart === "function") {
            updateTideChart(data);
        }

        return data;
    } catch (error) {
        console.error("Error fetching tide data:", error);
    }
};

// Update KPI values (next high, next low, range)
window.updateTideUI = function(data) {
    if (!data?.hourly?.time || !data?.hourly?.wave_height) return;

    const times = data.hourly.time;
    const heights = data.hourly.wave_height;

    // Convert ISO timestamps to Date objects
    const parsed = times.map((t, i) => ({
        time: new Date(t),
        value: heights[i]
    }));

    // Only keep "today"
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayData = parsed.filter(d => d.time.toISOString().startsWith(todayStr));

    if (todayData.length === 0) return;

    // Find max & min
    const maxPoint = todayData.reduce((a, b) => (b.value > a.value ? b : a));
    const minPoint = todayData.reduce((a, b) => (b.value < a.value ? b : a));

    // Update UI
    document.getElementById("next-high-value").textContent = `${maxPoint.value.toFixed(2)} m`;
    document.getElementById("next-high-time").textContent = maxPoint.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    document.getElementById("next-low-value").textContent = `${minPoint.value.toFixed(2)} m`;
    document.getElementById("next-low-time").textContent = minPoint.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    document.getElementById("tide-range").textContent = `${(maxPoint.value - minPoint.value).toFixed(2)} m`;
};

// Update tide chart
window.updateTideChart = function(data) {
    const ctx = document.getElementById("tideChartFull").getContext("2d");

    if (window.tideChart) {
        window.tideChart.destroy();
    }

    window.tideChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: data.hourly.time.map(t => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })),
            datasets: [{
                label: "Wave Height (m)",
                data: data.hourly.wave_height,
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: val => `${val} m`
                    }
                },
                x: {
                    ticks: {
                        maxTicksLimit: 6
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: { mode: "index", intersect: false }
            }
        }
    });
};

// 🔹 Alpine.js Component
// 🔹 Alpine Component for Tides Page
window.tideApp = function() {
    return {
        lat: 14.5995,
        lon: 120.9842,
        selectedStation: '',
        stations: [],

        async init() {
            try {
                const res = await fetch('/tides.json');
                this.stations = await res.json();
            } catch (err) {
                console.error('Error loading stations:', err);
            }
        },

        setStation(event) {
            const index = event.target.value;
            if (index === '') return;
            const s = this.stations[index];
            this.lat = s.Latitude;
            this.lon = s.Longitude;

            loadTideData(this.lat, this.lon).then(data => {
                if (data) {
                    // Save selection for dashboard
                    localStorage.setItem('tideStation', JSON.stringify({
                        station: s.Station,
                        data: data
                    }));

                    // Update immediately if card is visible
                    updateDashboardTide(s.Station, data);
                }
            });
        }
    }
}


// --- Save cleaned tide data for localStorage ---
function saveTideStation(stationName, data) {
    if (!data?.hourly?.time || !data?.hourly?.wave_height) return;

    const cleaned = {
        station: stationName,
        hourly: {
            time: data.hourly.time, // keep ISO strings
            wave_height: data.hourly.wave_height // numbers
        }
    };

    localStorage.setItem("tideStation", JSON.stringify(cleaned));
}


// 🔹 Restore last saved tide station
document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("tideStation");
    if (saved) {
        const { station, data } = JSON.parse(saved);
        updateDashboardTide(station, data);
    }
});
