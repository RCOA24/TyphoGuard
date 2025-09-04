/* eslint-disable */
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Esri Hybrid Basemap ---
function addBasemap(map) {
  const imagery = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    
  ).addTo(map);

  const labels = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
   
  ).addTo(map);

  return [imagery, labels];
}

// --- Main Init ---
const el = document.getElementById("radar-map");
if (!el) console.warn("#radar-map not found");
else {
  const map = L.map(el, { preferCanvas: true, zoomControl: true }).setView(
    [12.8797, 121.774], // Philippines center
    5
  );

  addBasemap(map);

  (async () => {
    try {
      const res = await fetch("https://api.rainviewer.com/public/weather-maps.json");
      const json = await res.json();

      // --- 24-Hour Frames ---
      const pastFrames = json?.radar?.past || [];
      const nowcastFrames = json?.radar?.nowcast || [];
      const maxFrames = 24 * 6; // 6 frames per hour × 24 hours
      const frames = [...pastFrames, ...nowcastFrames].slice(-maxFrames);

      if (!frames.length) throw new Error("No RainViewer frames");

      const layers = frames.map(f =>
        L.tileLayer(`https://tilecache.rainviewer.com${f.path}/256/{z}/{x}/{y}/2/1_1.png`, {
          opacity: 0,
         
          tileSize: 256
        })
      );

      layers.forEach(layer => layer.addTo(map));

      let index = layers.length - 1;
      let currentLayer = layers[index];
      currentLayer.setOpacity(0.7);

      let playing = false;
      let speed = 1000;
      let timer = null;

      function showFrame(i) {
        if (currentLayer) currentLayer.setOpacity(0);
        currentLayer = layers[i];
        currentLayer.setOpacity(0.7);
        index = i;
        updateLabel();
      }

      function nextFrame() { showFrame((index + 1) % layers.length); }
      function prevFrame() { showFrame((index - 1 + layers.length) % layers.length); }

      function play() {
        if (timer) clearInterval(timer);
        timer = setInterval(nextFrame, speed);
        playing = true;
        setPlayIcon(true);
      }

      function pause() {
        if (timer) clearInterval(timer);
        playing = false;
        setPlayIcon(false);
      }

      // --- Small Tailwind Controls ---
      const control = L.control({ position: "bottomleft" });
      let playBtn, prevBtn, nextBtn, speedInput, timeLabel;

      function setPlayIcon(isPlaying) {
        playBtn.innerHTML = isPlaying
          ? `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>`
          : `<svg class="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-6.518-3.76A1 1 0 007 8.308v7.384a1 1 0 001.234.968l6.518-3.76a1 1 0 000-1.736z" />
            </svg>`;
      }

      control.onAdd = function () {
        const div = L.DomUtil.create("div");
        // Smaller width and padding
        div.className = "bg-slate-900/80 text-white p-2 rounded-lg shadow-lg flex flex-col gap-2 w-40 sm:w-44";

        const row = L.DomUtil.create("div", "flex items-center justify-between gap-1", div);

        // Previous button
        prevBtn = L.DomUtil.create(
          "button",
          "w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center shadow-md transition-all duration-200",
          row
        );
        prevBtn.innerHTML = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11 19V5l-9 7 9 7zm2 0h2V5h-2v14z"/></svg>`;

        // Play/Pause button
        playBtn = L.DomUtil.create(
          "button",
          "w-10 h-10 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center shadow-md transition-all duration-200",
          row
        );
        setPlayIcon(false);

        // Next button
        nextBtn = L.DomUtil.create(
          "button",
          "w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center shadow-md transition-all duration-200",
          row
        );
        nextBtn.innerHTML = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 5v14l9-7-9-7zm-2 0h-2v14h2V5z"/></svg>`;

        // Speed slider
        const sliderWrap = L.DomUtil.create("div", "flex flex-col mt-1", div);
        const sliderLabel = L.DomUtil.create("label", "text-xs text-slate-300 mb-1", sliderWrap);
        sliderLabel.textContent = "Speed";

        speedInput = L.DomUtil.create("input", "w-full h-2 accent-green-500", sliderWrap);
        speedInput.type = "range";
        speedInput.min = 200;
        speedInput.max = 2000;
        speedInput.value = speed;

        timeLabel = L.DomUtil.create("div", "text-xs text-slate-300 mt-1 truncate", div);

        return div;
      };

      control.addTo(map);

      // Event handlers
      playBtn.onclick = () => (playing ? pause() : play());
      prevBtn.onclick = () => { pause(); prevFrame(); };
      nextBtn.onclick = () => { pause(); nextFrame(); };
      speedInput.oninput = () => { speed = +speedInput.value; if (playing) play(); };

      function updateLabel() {
        const t = frames[index].time * 1000;
        const d = new Date(t);
        timeLabel.textContent = `Frame: ${d.toLocaleString("en-PH", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}`;
      }

      showFrame(index);
    } catch (e) {
      console.error("RainViewer failed:", e);
    }
  })();

  map.whenReady(() => map.invalidateSize());
  window.addEventListener("resize", () => map.invalidateSize());
}
