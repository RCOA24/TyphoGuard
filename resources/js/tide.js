// ---------------- tide.js (copy-paste) ----------------

let tideChartFull;

// Fetch tide data from Open-Meteo API
window.loadTideData = async function (lat, lon, date) {
  try {
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height&timezone=auto&start_date=${date}&end_date=${date}`;
    const response = await fetch(url);
    const data = await response.json();

    if (typeof updateTideUI === "function") updateTideUI(data);
    if (typeof updateTideChart === "function") updateTideChart(data);

    return data;
  } catch (error) {
    console.error("Error fetching tide data:", error);
  }
};

// Update KPI values
window.updateTideUI = function (data) {
  if (!data?.hourly?.time || !data?.hourly?.wave_height) return;

  const parsed = data.hourly.time.map((t, i) => ({
    time: new Date(t),
    value: data.hourly.wave_height[i],
  }));

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayData = parsed.filter((d) =>
    d.time.toISOString().startsWith(todayStr)
  );

  if (!todayData.length) return;

  const maxPoint = todayData.reduce((a, b) => (b.value > a.value ? b : a));
  const minPoint = todayData.reduce((a, b) => (b.value < a.value ? b : a));

  document.getElementById("next-high-value").textContent = `${maxPoint.value.toFixed(2)} m`;
  document.getElementById("next-high-time").textContent = maxPoint.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  document.getElementById("next-low-value").textContent = `${minPoint.value.toFixed(2)} m`;
  document.getElementById("next-low-time").textContent = minPoint.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  document.getElementById("tide-range").textContent = `${(maxPoint.value - minPoint.value).toFixed(2)} m`;
};

// Update tide chart
window.updateTideChart = function (data) {
  const ctx = document.getElementById("tideChartFull").getContext("2d");

  if (window.tideChart) window.tideChart.destroy();

  window.tideChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.hourly.time.map((t) =>
        new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      ),
      datasets: [
        {
          label: "Wave Height (m)",
          data: data.hourly.wave_height,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, ticks: { callback: (val) => `${val} m` } },
        x: { ticks: { maxTicksLimit: 6 } },
      },
      plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false } },
    },
  });
};

// Reverse geocoding
async function getLocationName(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await res.json();
    const a = data.address || {};
    return a.city || a.town || a.village || a.county || "Current Location";
  } catch (err) {
    console.error("Reverse geocoding failed:", err);
    return "Current Location";
  }
}

// -------- Alpine.js component --------
window.tideApp = function () {
  return {
    lat: 14.5995,
    lon: 120.9842,
    selectedRegion: "",
    selectedStation: "",
    userLocation: "", // display label for live location
    stations: [],     // ALWAYS: [{ region, stations: [{ station, lat, lon }] }]
    date: new Date().toISOString().slice(0, 10),
    showData: true,

    // Consent + loader
    showConsentModal: false,
    loadingLocation: false,

    confirmLocation() {
      this.showConsentModal = false;
      localStorage.setItem("locationConsent", "granted");
      this.useMyLocation();
    },

    // Normalize whatever /tides.json returns into grouped-by-region shape
    normalizeStations(raw) {
      // Already grouped
      if (Array.isArray(raw) && raw[0]?.region && raw[0]?.stations) return raw;
      if (raw && Array.isArray(raw.regions)) return raw.regions;

      // Flat list -> group
      if (Array.isArray(raw)) {
        const map = {};
        raw.forEach((row) => {
          const region = row.State || row.region || "Others";
          const station = row.Station || row.station;
          const lat = Number(row.Latitude ?? row.lat);
          const lon = Number(row.Longitude ?? row.lon);
          if (!station || Number.isNaN(lat) || Number.isNaN(lon)) return;
          map[region] = map[region] || [];
          map[region].push({ station, lat, lon });
        });
        return Object.keys(map)
          .sort()
          .map((r) => ({ region: r, stations: map[r] }));
      }

      console.warn("Unrecognized tides.json format:", raw);
      return [];
    },

    

    async init() {
      try {
        const res = await fetch("/tides.json");
        const raw = await res.json();
        this.stations = this.normalizeStations(raw);

        // Only show consent if we don't have a decision yet
        const consent = localStorage.getItem("locationConsent");
        if (!consent) {
          this.showConsentModal = true;
        }

        // Restore last saved tide data (supports both old/new shapes)
        const saved = localStorage.getItem("tideStation");
        if (saved) {
          const obj = JSON.parse(saved);
          if (obj?.hourly) {
            // new saved shape
            updateDashboardTide(obj.station ?? "Saved Station", { hourly: obj.hourly });
          } else if (obj?.data?.hourly) {
            // legacy shape
            updateDashboardTide(obj.station ?? "Saved Station", obj.data);
          }
        }
      } catch (err) {
        console.error("Error loading stations:", err);
      }
    },

    async setStation(event) {
      const value = event.target.value;

      if (value === "") {
        this.resetData();
        return;
      }

      if (value === "user") {
        // Use whatever lat/lon we currently have from geolocation
        const data = await loadTideData(this.lat, this.lon, this.date);
        if (data) updateDashboardTide(this.userLocation || "Current Location", data);
        return;
      }

      // Parse "rIndex-sIndex"
      const [rIndex, sIndex] = value.split("-").map(Number);
      const region = this.stations[rIndex];
      const s = region?.stations?.[sIndex];
      if (!s) {
        console.warn("Selected station not found for value:", value);
        return;
      }

      this.lat = s.lat;
      this.lon = s.lon;

      const data = await loadTideData(this.lat, this.lon, this.date);
      if (data) {
        this.saveTideStation(s.station, data);
        updateDashboardTide(s.station, data);
      }
    },

    async useMyLocation() {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }

      this.loadingLocation = true;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          this.lat = position.coords.latitude;
          this.lon = position.coords.longitude;

          // x-model updates inputs automatically — no manual DOM update needed
          this.userLocation = await getLocationName(this.lat, this.lon);

          // Show "Current Location" option in dropdown and select it
          this.selectedStation = "user";

          const data = await loadTideData(this.lat, this.lon, this.date);
          if (data) updateDashboardTide(this.userLocation, data);

          this.loadingLocation = false;
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location.");
          this.loadingLocation = false;
        }
      );
    },

async refreshData() {
  this.showData = false;

  setTimeout(async () => {
    // 🔄 Reset core state
    this.selectedRegion = ""; 
    this.selectedStation = "";
    this.userLocation = "";
    this.lat = 14.5995;
    this.lon = 120.9842;

    // 🔄 Reset KPIs
    document.getElementById("next-high-value").textContent = "--";
    document.getElementById("next-high-time").textContent = "--";
    document.getElementById("next-low-value").textContent = "--";
    document.getElementById("next-low-time").textContent = "--";
    document.getElementById("tide-range").textContent = "--";

    // 🔄 Destroy chart
    if (window.tideChart) {
      window.tideChart.destroy();
      window.tideChart = null;
    }

    // 🔄 Clear saved station
    localStorage.removeItem("tideStation");

    // 🔄 Reload stations from tides.json
    try {
      const res = await fetch("/tides.json");
      const raw = await res.json();
      this.stations = this.normalizeStations(raw);
    } catch (err) {
      console.error("Error reloading stations:", err);
      this.stations = [];
    }

    this.showData = true;

    // ✅ Reload fresh tide data if something was selected before reset
    if (this.selectedStation === "user" && this.userLocation) {
      const data = await loadTideData(this.lat, this.lon, this.date);
      if (data) updateDashboardTide(this.userLocation, data);
    } else if (this.selectedRegion !== "" && this.selectedStation !== "") {
      const [rIndex, sIndex] = this.selectedStation.split("-").map(Number);
      const s = this.stations[rIndex]?.stations[sIndex];
      if (s) {
        this.lat = s.lat;
        this.lon = s.lon;
        const data = await loadTideData(this.lat, this.lon, this.date);
        if (data) updateDashboardTide(s.station, data);
      }
    }
  }, 300);
},



    saveTideStation(stationName, data) {
      // save compact, and read it back accordingly in init()
      if (!data?.hourly?.time || !data?.hourly?.wave_height) return;

      const cleaned = {
        station: stationName,
        hourly: {
          time: data.hourly.time,
          wave_height: data.hourly.wave_height,
        },
      };

      localStorage.setItem("tideStation", JSON.stringify(cleaned));
    },
  };
};

// Keep this — you might later display stationName somewhere in the UI
function updateDashboardTide(stationName, data) {
  updateTideUI(data);
  updateTideChart(data);
}
// ---------------- end tide.js ----------------
