/* eslint-disable */
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Esri Hybrid Basemap ---
function addBasemap(map) {
  const imagery = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { attribution: "Imagery © Esri", maxZoom: 19 }
  ).addTo(map);

  const labels = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    { attribution: "Boundaries & Places © Esri", maxZoom: 19 }
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

      const frames = [...(json?.radar?.past || []), ...(json?.radar?.nowcast || [])];
      if (!frames.length) throw new Error("No RainViewer frames");

      // --- Prepare tile layers with lazy visibility ---
      const layers = frames.map(f =>
        L.tileLayer(`https://tilecache.rainviewer.com${f.path}/256/{z}/{x}/{y}/2/1_1.png`, {
          opacity: 0.7,
          attribution: "Radar © RainViewer",
          tileSize: 256
        })
      );

      // Preload layers in background without adding them all at once
      layers.forEach(layer => {
        const container = document.createElement("div"); // temp container
        layer.addTo(map);
        layer.setOpacity(0);
      });

      let index = layers.length - 1;
      let currentLayer = layers[index];
      currentLayer.setOpacity(0.7); // show last frame

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
        playBtn.textContent = "⏸ Pause";
      }

      function pause() {
        if (timer) clearInterval(timer);
        playing = false;
        playBtn.textContent = "▶ Play";
      }

      // --- Tailwind UI Controls ---
      const control = L.control({ position: "bottomleft" });
      let playBtn, prevBtn, nextBtn, speedInput, timeLabel;

      control.onAdd = function () {
        const div = L.DomUtil.create("div");
        div.className = "bg-slate-900/70 text-white p-3 rounded-lg shadow-lg flex flex-col gap-2";

        const row = L.DomUtil.create("div", "flex items-center gap-2", div);

        prevBtn = L.DomUtil.create("button", "px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm", row);
        prevBtn.textContent = "⏮";

        playBtn = L.DomUtil.create("button", "px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-sm font-semibold", row);
        playBtn.textContent = "▶ Play";

        nextBtn = L.DomUtil.create("button", "px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm", row);
        nextBtn.textContent = "⏭";

        const sliderWrap = L.DomUtil.create("div", "flex flex-col mt-2", div);
        const sliderLabel = L.DomUtil.create("label", "text-xs text-slate-300 mb-1", sliderWrap);
        sliderLabel.textContent = "Animation Speed";

        speedInput = L.DomUtil.create("input", "w-32", sliderWrap);
        speedInput.type = "range";
        speedInput.min = 200;
        speedInput.max = 2000;
        speedInput.value = speed;

        timeLabel = L.DomUtil.create("div", "text-xs text-slate-300 mt-1", div);

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

      // Show last available frame first
      showFrame(index);
    } catch (e) {
      console.error("RainViewer failed:", e);
    }
  })();

  map.whenReady(() => map.invalidateSize());
}
