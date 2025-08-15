document.addEventListener('DOMContentLoaded', async function () {
    // 1️⃣ Initialize map centered on Manila Bay
    const map = L.map('manila-bay-map').setView([14.556, 120.98], 11);

    // 2️⃣ Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 3️⃣ Define tide stations
    const stations = [
        { name: "Manila", lat: 14.5995, lon: 120.9842 },
        { name: "Cavite", lat: 14.4785, lon: 120.9090 },
        { name: "Laguna", lat: 14.1797, lon: 121.2433 },
    ];

    // 4️⃣ Create markers and circles for each station
    const stationElements = stations.map(station => {
        const marker = L.marker([station.lat, station.lon]).addTo(map).bindPopup('Loading...');
        const circle = L.circle([station.lat, station.lon], { radius: 50, color: 'blue', fillOpacity: 0.2 }).addTo(map);
        return { ...station, marker, circle };
    });

    // 5️⃣ Function to fetch sea level from Open-Meteo API for a single station
    async function fetchSeaLevel(lat, lon) {
        try {
            const res = await fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=sea_level_height_msl&timezone=Asia/Manila`);
            const data = await res.json();
            const latestSeaLevel = data.hourly.sea_level_height_msl.slice(-1)[0];
            const latestTime = data.hourly.time.slice(-1)[0];
            return { seaLevel: latestSeaLevel, time: latestTime };
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    // 6️⃣ Update all stations
    async function updateStations() {
        for (const station of stationElements) {
            const result = await fetchSeaLevel(station.lat, station.lon);
            if (result) {
                // Update marker popup
                station.marker.setPopupContent(`${station.name} Sea Level: ${result.seaLevel.toFixed(2)} m at ${result.time}`);
                // Update circle radius (scaled by sea level, e.g., 1m = 50px)
                const radius = 50 + result.seaLevel * 50;
                station.circle.setRadius(radius);
            }
        }
    }

    // 7️⃣ Initial update and periodic refresh every minute
    updateStations();
    setInterval(updateStations, 60 * 1000);
});
