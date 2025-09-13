// Optimized tide.js with caching, search, and no-data handling

let tideChartFull;

// ---------------- Cache ----------------
const apiCache = new Map();
const searchCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ---------------- Fetch Tide Data ----------------
window.loadTideData = async function (lat, lon, date) {
  const cacheKey = `${lat}-${lon}-${date}`;
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("Using cached tide data");
    updateTideUI(cached.data);
    updateTideChart(cached.data);
    // Call handleDataSuccess for cached data too
    if (window.__tideAppInstance) {
      window.__tideAppInstance.handleDataSuccess(cached.data);
    }
    return cached.data;
  }

  try {
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height&timezone=auto&start_date=${date}&end_date=${date}`;
    const response = await fetch(url);
    const data = await response.json();

    // Check if data is empty or invalid
    if (!data?.hourly?.time?.length || !data?.hourly?.wave_height?.length) {
      console.warn("No marine data available for this location");
      if (window.__tideAppInstance) {
        window.__tideAppInstance.handleNoData();
      }
      return null;
    }

    // Check if all wave heights are null/undefined
    const validData = data.hourly.wave_height.filter(h => h !== null && h !== undefined && !isNaN(h));
    if (validData.length === 0) {
      console.warn("No valid wave height data for this location");
      if (window.__tideAppInstance) {
        window.__tideAppInstance.handleNoData();
      }
      return null;
    }

    apiCache.set(cacheKey, { data, timestamp: Date.now() });

    updateTideUI(data);
    updateTideChart(data);
    
    // Call handleDataSuccess when data is successfully loaded
    if (window.__tideAppInstance) {
      window.__tideAppInstance.handleDataSuccess(data);
    }

    return data;
  } catch (error) {
    console.error("Error fetching tide data:", error);
    if (window.__tideAppInstance) {
      window.__tideAppInstance.handleNoData();
    }
    return null;
  }
};

// ---------------- Search Location ----------------
async function searchLocation(query) {
  const normalized = query.toLowerCase().trim();
  const cached = searchCache.get(normalized);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("Using cached search results");
    return cached.data;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&limit=5&countrycodes=ph`;
    const response = await fetch(url);
    const data = await response.json();

    const results = data.map((item) => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    }));

    searchCache.set(normalized, { data: results, timestamp: Date.now() });
    return results;
  } catch (error) {
    console.error("Error searching locations:", error);
    return [];
  }
}

// ---------------- KPI Updates ----------------
window.updateTideUI = function (data) {
  if (!data?.hourly?.time || !data?.hourly?.wave_height) {
    // If no data, trigger the no-data handler
    if (window.__tideAppInstance) {
      window.__tideAppInstance.handleNoData();
    }
    return;
  }

  const parsed = data.hourly.time.map((t, i) => ({
    time: new Date(t),
    value: data.hourly.wave_height[i],
  }));

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayData = parsed.filter((d) =>
    d.time.toISOString().startsWith(todayStr)
  );

  if (!todayData.length) {
    // If no data for today, trigger the no-data handler
    if (window.__tideAppInstance) {
      window.__tideAppInstance.handleNoData();
    }
    return;
  }

  const maxPoint = todayData.reduce((a, b) => (b.value > a.value ? b : a));
  const minPoint = todayData.reduce((a, b) => (b.value < a.value ? b : a));

  requestAnimationFrame(() => {
    document.getElementById("next-high-value").textContent =
      `${maxPoint.value.toFixed(2)} m`;
    document.getElementById("next-high-time").textContent =
      maxPoint.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    document.getElementById("next-low-value").textContent =
      `${minPoint.value.toFixed(2)} m`;
    document.getElementById("next-low-time").textContent =
      minPoint.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    document.getElementById("tide-range").textContent =
      `${(maxPoint.value - minPoint.value).toFixed(2)} m`;
  });
};

// ---------------- Chart Updates ----------------
window.updateTideChart = function (data) {
  const ctx = document.getElementById("tideChartFull")?.getContext("2d");
  if (!ctx) return;
  if (window.tideChart) window.tideChart.destroy();

  const step = Math.ceil(data.hourly.time.length / 24);
  const indices = [];
  for (let i = 0; i < data.hourly.time.length; i += step) indices.push(i);

  window.tideChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: indices.map((i) =>
        new Date(data.hourly.time[i]).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      ),
      datasets: [
        {
          label: "Wave Height (m)",
          data: indices.map((i) => data.hourly.wave_height[i]),
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.4,
          fill: true,
          pointRadius: 2,
          pointHoverRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      scales: {
        y: { beginAtZero: true, ticks: { callback: (v) => `${v} m` } },
        x: { ticks: { maxTicksLimit: 6 } },
      },
      plugins: {
        legend: { display: false },
        tooltip: { mode: "index", intersect: false },
      },
    },
  });
};

// ---------------- Reverse Geocoding ----------------
async function getLocationName(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await res.json();
    const a = data.address || {};
    return a.city || a.town || a.village || a.county || "Current Location";
  } catch {
    return "Current Location";
  }
}

// ---------------- Alpine.js Component ----------------
window.tideApp = function () {
  return {
    lat: "",
    lon: "",
    userLocation: "",
    date: new Date().toISOString().slice(0, 10),
    showData: false,
    showNoDataMessage: false,

    searchQuery: "",
    searchResults: [],
    showSearchResults: false,
    isSearching: false,
    searchInputFocused: false,
    searchController: null,

    showConsentModal: false,
    loadingLocation: false,

    initGlobal() {
      window.__tideAppInstance = this;
    },

    confirmLocation() {
      this.showConsentModal = false;
      localStorage.setItem("locationConsent", "granted");
      this.useMyLocation();
    },

    handleDataSuccess(data) {
      console.log("Data success called", data);
      this.showData = true;
      this.showNoDataMessage = false;
      // Force Alpine to update the DOM
      this.$nextTick(() => {
        console.log("DOM updated, showData:", this.showData);
      });
    },

    handleNoData() {
      console.log("No data called");
      this.showData = false;
      this.showNoDataMessage = true;

      // Clear the KPI values immediately
      requestAnimationFrame(() => {
        const elements = [
          "next-high-value", "next-high-time", 
          "next-low-value", "next-low-time", 
          "tide-range"
        ];
        elements.forEach(id => {
          const element = document.getElementById(id);
          if (element) {
            element.textContent = id.includes('time') ? '--' : '-- m';
          }
        });
      });

      // Destroy chart
      if (window.tideChart) {
        window.tideChart.destroy();
        window.tideChart = null;
      }

      // Force Alpine to update the DOM
      this.$nextTick(() => {
        console.log("DOM updated, showNoDataMessage:", this.showNoDataMessage);
      });
    },

    async performSearch() {
      const query = this.searchQuery.trim();
      if (query.length < 2) {
        this.searchResults = [];
        this.showSearchResults = false;
        return;
      }

      if (this.searchController) this.searchController.abort();
      this.searchController = new AbortController();

      this.isSearching = true;
      try {
        const results = await searchLocation(query);
        if (!this.searchController.signal.aborted) {
          this.searchResults = results;
          this.showSearchResults = results.length > 0;
        }
      } catch {
        this.searchResults = [];
        this.showSearchResults = false;
      }
      this.isSearching = false;
    },

    async selectSearchResult(result) {
      this.lat = result.lat;
      this.lon = result.lon;
      this.searchQuery = result.display_name.split(",")[0];
      this.showSearchResults = false;

      // Reset states before loading
      this.showData = false;
      this.showNoDataMessage = false;

      const data = await loadTideData(this.lat, this.lon, this.date);
      if (data) {
        this.saveTideStation(this.searchQuery, data);
        updateDashboardTide(this.searchQuery, data);
      }
    },

    clearSearch() {
      this.searchQuery = "";
      this.searchResults = [];
      this.showSearchResults = false;
      this.lat = "";
      this.lon = "";
      this.showData = false;
      this.showNoDataMessage = false;
    },

    onSearchFocus() {
      this.searchInputFocused = true;
      if (this.searchResults.length > 0) this.showSearchResults = true;
    },

    onSearchBlur() {
      setTimeout(() => {
        this.searchInputFocused = false;
        this.showSearchResults = false;
      }, 300);
    },

    async init() {
      // IMPORTANT: Initialize global reference first
      this.initGlobal();
      
      try {
        if (!localStorage.getItem("locationConsent")) {
          this.showConsentModal = true;
        }
        const saved = localStorage.getItem("tideStation");
        if (saved) {
          const obj = JSON.parse(saved);
          if (obj?.hourly) {
            updateDashboardTide(obj.station ?? "Saved Station", { hourly: obj.hourly });
            this.handleDataSuccess({ hourly: obj.hourly });
          }
        }
      } catch (err) {
        console.error("Init error:", err);
      }
    },

    async useMyLocation() {
      if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
      }
      this.loadingLocation = true;
      
      // Reset states before loading
      this.showData = false;
      this.showNoDataMessage = false;
      
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          this.lat = pos.coords.latitude;
          this.lon = pos.coords.longitude;
          this.userLocation = await getLocationName(this.lat, this.lon);

          const data = await loadTideData(this.lat, this.lon, this.date);
          if (data) {
            updateDashboardTide(this.userLocation, data);
          }
          this.loadingLocation = false;
        },
        () => {
          alert("Unable to retrieve location");
          this.loadingLocation = false;
        }
      );
    },

    async refreshData() {
      this.showData = false;
      this.showNoDataMessage = false;

      setTimeout(() => {
        this.userLocation = "";
        this.lat = "";
        this.lon = "";
        this.searchQuery = "";
        this.searchResults = [];
        this.showSearchResults = false;

        requestAnimationFrame(() => {
          const elements = [
            "next-high-value", "next-high-time", 
            "next-low-value", "next-low-time", 
            "tide-range"
          ];
          elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
              element.textContent = id.includes('time') ? '--' : '-- m';
            }
          });
        });

        if (window.tideChart) {
          window.tideChart.destroy();
          window.tideChart = null;
        }

        localStorage.removeItem("tideStation");
      }, 300);
    },

    saveTideStation(stationName, data) {
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

function updateDashboardTide(stationName, data) {
  updateTideUI(data);
  updateTideChart(data);
}