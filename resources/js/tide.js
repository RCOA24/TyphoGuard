// Optimized tide.js with CORS-free instant search

let tideChartFull;

// ---------------- Enhanced Cache with Longer Duration ----------------
const apiCache = new Map();
const searchCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for better performance
const SEARCH_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for search results

// ---------------- Debounce Utility ----------------
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ---------------- Fetch Tide Data ----------------
window.loadTideData = async function (lat, lon, date) {
  const cacheKey = `${lat}-${lon}-${date}`;
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("Using cached tide data");
    updateTideUI(cached.data);
    updateTideChart(cached.data);
    if (window.__tideAppInstance) {
      window.__tideAppInstance.handleDataSuccess(cached.data);
    }
    return cached.data;
  }

  try {
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height&timezone=auto&start_date=${date}&end_date=${date}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data?.hourly?.time?.length || !data?.hourly?.wave_height?.length) {
      console.warn("No marine data available for this location");
      if (window.__tideAppInstance) {
        window.__tideAppInstance.handleNoData();
      }
      return null;
    }

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

// ---------------- CORS-Free Location Search ----------------
async function searchLocationNew(query) {
  const normalized = query.toLowerCase().trim();
  console.log("🔍 NEW: Searching for:", normalized);
  
  const cached = searchCache.get(normalized);

  // Return cached results immediately
  if (cached && Date.now() - cached.timestamp < SEARCH_CACHE_DURATION) {
    console.log("✅ NEW: Using cached search results:", cached.data.length, "results");
    return cached.data;
  }

  // Strategy 1: Direct CORS-enabled API (Photon - most reliable)
  try {
    console.log("🔄 NEW: Trying Photon API...");
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query + ' Philippines')}&limit=8`;
    console.log("🌐 NEW: Photon URL:", photonUrl);
    
    const response = await fetch(photonUrl);
    console.log("📡 NEW: Photon response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`Photon API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("📦 NEW: Raw Photon data:", data);
    
    if (data.features && Array.isArray(data.features)) {
      const results = data.features
        .filter(item => {
          const coords = item.geometry?.coordinates;
          const hasCoords = coords && coords.length >= 2;
          if (!hasCoords) console.log("❌ NEW: Filtered out item missing coordinates");
          return hasCoords;
        })
        .map((item) => {
          const props = item.properties || {};
          const coords = item.geometry.coordinates;
          
          // Build display name
          let displayName = props.name || props.street || 'Unknown Location';
          if (props.city || props.state) {
            const parts = [props.name, props.city, props.state].filter(Boolean);
            displayName = parts.join(', ');
          }

          const result = {
            display_name: displayName,
            full_display_name: displayName,
            lat: coords[1], // Photon returns [lng, lat]
            lon: coords[0],
            type: props.osm_value || 'place',
            importance: 0.7 // Default importance
          };
          
          console.log("✨ NEW: Processed Photon result:", result);
          return result;
        })
        .slice(0, 6);

      if (results.length > 0) {
        console.log("✅ NEW: Photon succeeded with", results.length, "results");
        searchCache.set(normalized, { data: results, timestamp: Date.now() });
        return results;
      }
    }
  } catch (error) {
    console.log("❌ NEW: Photon failed:", error.message);
  }

  // Strategy 2: CORS Proxy for Nominatim
  try {
    console.log("🔄 NEW: Trying CORS proxy...");
    const nominatimQuery = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&countrycodes=ph`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(nominatimQuery)}`;
    console.log("🌐 NEW: Proxy URL:", proxyUrl);
    
    const response = await fetch(proxyUrl);
    console.log("📡 NEW: Proxy response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`Proxy error: ${response.status}`);
    }
    
    const proxyData = await response.json();
    console.log("📦 NEW: Raw proxy data:", proxyData);
    
    const data = JSON.parse(proxyData.contents);
    console.log("📦 NEW: Parsed Nominatim data:", data);
    
    if (Array.isArray(data)) {
      const results = data
        .filter(item => item.lat && item.lon)
        .map((item) => {
          const result = {
            display_name: item.display_name.split(',').slice(0, 2).join(', '),
            full_display_name: item.display_name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            type: item.type || 'place',
            importance: item.importance || 0.5
          };
          
          console.log("✨ NEW: Processed Nominatim result:", result);
          return result;
        })
        .slice(0, 6);

      if (results.length > 0) {
        console.log("✅ NEW: Proxy succeeded with", results.length, "results");
        searchCache.set(normalized, { data: results, timestamp: Date.now() });
        return results;
      }
    }
  } catch (error) {
    console.log("❌ NEW: Proxy failed:", error.message);
  }

  // Strategy 3: Fallback to basic geocoding service
  try {
    console.log("🔄 NEW: Trying geocode.xyz...");
    const geocodeUrl = `https://geocode.xyz/${encodeURIComponent(query + ' Philippines')}?json=1&region=PH`;
    console.log("🌐 NEW: Geocode URL:", geocodeUrl);
    
    const response = await fetch(geocodeUrl);
    console.log("📡 NEW: Geocode response status:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log("📦 NEW: Geocode data:", data);
      
      if (data.latt && data.longt && data.standard && data.standard.city) {
        const result = {
          display_name: `${data.standard.city}, ${data.standard.prov || 'Philippines'}`,
          full_display_name: data.standard.addresst || data.standard.city,
          lat: parseFloat(data.latt),
          lon: parseFloat(data.longt),
          type: 'city',
          importance: 0.6
        };
        
        console.log("✅ NEW: Geocode succeeded with 1 result:", result);
        const results = [result];
        searchCache.set(normalized, { data: results, timestamp: Date.now() });
        return results;
      }
    }
  } catch (error) {
    console.log("❌ NEW: Geocode failed:", error.message);
  }

  // Return cached results even if expired, as ultimate fallback
  if (cached) {
    console.log("🔄 NEW: Using expired cached results as fallback:", cached.data.length, "results");
    return cached.data;
  }

  console.log("❌ NEW: All strategies failed, returning empty results");
  return [];
}

// ---------------- KPI Updates ----------------
window.updateTideUI = function (data) {
  if (!data?.hourly?.time || !data?.hourly?.wave_height) {
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
    // Use CORS-friendly reverse geocoding
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    )}`);
    const proxyData = await res.json();
    const data = JSON.parse(proxyData.contents);
    const a = data.address || {};
    return a.city || a.town || a.village || a.county || "Current Location";
  } catch {
    return "Current Location";
  }
}

// ---------------- Enhanced Alpine.js Component ----------------
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
    lastSearchQuery: "", // Track last search to avoid duplicate searches

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
      this.$nextTick(() => {
        console.log("DOM updated, showData:", this.showData);
      });
    },

    handleNoData() {
      console.log("No data called");
      this.showData = false;
      this.showNoDataMessage = true;

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

      this.$nextTick(() => {
        console.log("DOM updated, showNoDataMessage:", this.showNoDataMessage);
      });
    },

    // Debounced search function for instant feel
    debouncedSearch: null,

    // Initialize debounced search in init
    initDebouncedSearch() {
      this.debouncedSearch = debounce(async (query) => {
        await this.performActualSearch(query);
      }, 200); // 200ms debounce - feels instant but reduces API calls
    },

    // Legacy method for backward compatibility (calls the new method)
    async performSearch() {
      console.log("📞 NEW: performSearch() called (legacy method)");
      this.onSearchInput();
    },

    // Called immediately on input change
    onSearchInput() {
      const query = this.searchQuery.trim();
      console.log("🎯 NEW: Search input changed:", query);
      
      // Show loading state immediately
      if (query.length >= 2) {
        console.log("⏳ NEW: Setting loading state");
        this.isSearching = true;
        this.showSearchResults = true;
        
        // Show previous results if available while searching
        const cachedResults = searchCache.get(query.toLowerCase());
        if (cachedResults && cachedResults.data.length > 0) {
          console.log("🎉 NEW: Found cached results immediately:", cachedResults.data.length);
          this.searchResults = cachedResults.data;
          this.isSearching = false;
        }
      } else {
        console.log("🔄 NEW: Query too short, clearing results");
        this.searchResults = [];
        this.showSearchResults = false;
        this.isSearching = false;
      }

      // Cancel previous search
      if (this.searchController) {
        this.searchController.abort();
        console.log("⛔ NEW: Cancelled previous search");
      }

      // Trigger debounced search
      if (query.length >= 2 && query !== this.lastSearchQuery) {
        console.log("🚀 NEW: Triggering debounced search");
        this.debouncedSearch(query);
      }
    },

    // Actual search function using the NEW search method
    async performActualSearch(query) {
      console.log("🔄 NEW: Performing actual search for:", query);
      
      if (query !== this.searchQuery.trim()) {
        console.log("❌ NEW: Query changed, aborting search");
        return; // Query changed, ignore this search
      }

      this.lastSearchQuery = query;
      this.searchController = new AbortController();

      try {
        console.log("📞 NEW: Calling searchLocationNew API");
        const results = await searchLocationNew(query); // Using NEW function
        console.log("📥 NEW: Got search results:", results);
        
        // Check if query is still current
        if (!this.searchController.signal.aborted && query === this.searchQuery.trim()) {
          console.log("✅ NEW: Setting results in UI:", results.length, "results");
          this.searchResults = results;
          this.showSearchResults = results.length > 0;
          this.isSearching = false;
          
          // Force reactivity update
          this.$nextTick(() => {
            console.log("🔄 NEW: DOM updated with search results");
          });
        } else {
          console.log("⚠️ NEW: Search aborted or query changed");
        }
      } catch (error) {
        if (!this.searchController.signal.aborted) {
          console.error("💥 NEW: Search error in performActualSearch:", error);
          this.searchResults = [];
          this.showSearchResults = false;
          this.isSearching = false;
        }
      }
    },

    async selectSearchResult(result) {
      this.lat = result.lat;
      this.lon = result.lon;
      this.searchQuery = result.display_name;
      this.showSearchResults = false;
      this.isSearching = false;

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
      this.lastSearchQuery = "";
      this.searchResults = [];
      this.showSearchResults = false;
      this.isSearching = false;
      this.lat = "";
      this.lon = "";
      this.showData = false;
      this.showNoDataMessage = false;
      
      if (this.searchController) {
        this.searchController.abort();
      }
    },

    onSearchFocus() {
      this.searchInputFocused = true;
      if (this.searchResults.length > 0) {
        this.showSearchResults = true;
      }
    },

    onSearchBlur() {
      setTimeout(() => {
        this.searchInputFocused = false;
        this.showSearchResults = false;
      }, 300);
    },

    // Keyboard navigation for search results
    onSearchKeydown(event) {
      if (event.key === 'Escape') {
        this.showSearchResults = false;
        event.target.blur();
      }
      // Add arrow key navigation if needed
    },

    async init() {
      // Initialize global reference and debounced search
      this.initGlobal();
      this.initDebouncedSearch();
      
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
        this.lastSearchQuery = "";
        this.searchResults = [];
        this.showSearchResults = false;
        this.isSearching = false;

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