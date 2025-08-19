/* eslint-disable */
const tideCharts = {}; // store multiple chart instances keyed by canvas id

function formatTime12(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

function findNextTide(times, heights, type = 'high') {
    const now = Date.now();
    for (let i = 1; i < heights.length - 1; i++) {
        const t = new Date(times[i]).getTime();
        if (t <= now) continue;
        if (type === 'high' && heights[i] > heights[i-1] && heights[i] > heights[i+1])
            return { time: new Date(t), height: heights[i], index: i };
        if (type === 'low' && heights[i] < heights[i-1] && heights[i] < heights[i+1])
            return { time: new Date(t), height: heights[i], index: i };
    }
    return null;
}

function setText(el, text) { if (el) el.textContent = text; }

function updateHighTideCard(nextHigh) {
    if (!nextHigh) return;
    const now = new Date();
    const diffMs = nextHigh.time - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    setText(document.querySelector('.kpi'), `High in ${diffHours}h ${diffMinutes}m`);
    setText(document.querySelector('.next-high'), `Next high: ${nextHigh.height.toFixed(2)} m @ ${formatTime12(nextHigh.time)}`);
    setText(document.getElementById('next-high-value'), `${nextHigh.height.toFixed(2)} m (in ${diffHours}h ${diffMinutes}m)`);
    setText(document.getElementById('next-high-time'), formatTime12(nextHigh.time));
}

function updateLowTideCard(nextLow) {
    if (!nextLow) return;
    const now = new Date();
    const diffMs = nextLow.time - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    setText(document.querySelector('.kpi-low'), `Low in ${diffHours}h ${diffMinutes}m`);
    setText(document.querySelector('.next-low'), `Next low: ${nextLow.height.toFixed(2)} m @ ${formatTime12(nextLow.time)}`);
    setText(document.getElementById('next-low-value'), `${nextLow.height.toFixed(2)} m (in ${diffHours}h ${diffMinutes}m)`);
    setText(document.getElementById('next-low-time'), formatTime12(nextLow.time));
}

function updateTideRange(heights) {
    const todayLevels = heights.slice(0, 24);
    const maxLevel = Math.max(...todayLevels);
    const minLevel = Math.min(...todayLevels);
    setText(document.getElementById('tide-range'), `${(maxLevel - minLevel).toFixed(2)} m`);
}

// --- Chart Init / Update for multiple canvases ---
function renderTideChart(id, times, heights, nextHigh) {
    const ctx = document.getElementById(id)?.getContext('2d');
    if (!ctx) return;

    const formattedTimes = times.map(t => formatTime12(new Date(t)));
    const pointColors = heights.map((h, i) => (nextHigh && i === nextHigh.index ? 'red' : '#0284c7'));
    const pointSizes = heights.map((h, i) => (nextHigh && i === nextHigh.index ? 6 : 3));

    if (!tideCharts[id]) {
        // Create chart
        tideCharts[id] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: formattedTimes,
                datasets: [{
                    label: 'Sea Level Height (m)',
                    data: heights,
                    borderColor: '#0284c7',
                    backgroundColor: 'rgba(2, 132, 199, 0.2)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: pointSizes,
                    pointBackgroundColor: pointColors
                }]
            },
            options: {
                responsive: true,
                animation: { duration: 300, easing: 'easeInOutQuad' },
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 12 } },
                    y: { beginAtZero: false }
                }
            }
        });
    } else {
        // Update chart
        const chart = tideCharts[id];
        chart.data.labels = formattedTimes;
        chart.data.datasets[0].data = heights;
        chart.data.datasets[0].pointBackgroundColor = pointColors;
        chart.data.datasets[0].pointRadius = pointSizes;
        chart.update('none'); // fast update without animation
    }
}

// --- Caching & Fetch ---
const CACHE_KEY = 'tideData';
const CACHE_TTL = 5 * 60 * 1000; // 5 min

async function loadTideData() {
    try {
        const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
        const now = Date.now();
        if (cached && now - cached.timestamp < CACHE_TTL) {
            updateTideUI(cached.data);
            return;
        }

        const response = await fetch(
            'https://marine-api.open-meteo.com/v1/marine?latitude=14.556&longitude=120.98&hourly=sea_level_height_msl&timezone=Asia/Manila'
        );
        const data = await response.json();
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: now }));

        updateTideUI(data);
    } catch (err) {
        console.error('Error fetching tide data:', err);
    }
}

function updateTideUI(data) {
    const times = data.hourly.time;
    const heights = data.hourly.sea_level_height_msl;

    const nextHigh = findNextTide(times, heights, 'high');
    const nextLow = findNextTide(times, heights, 'low');

    updateHighTideCard(nextHigh);
    updateLowTideCard(nextLow);
    updateTideRange(heights);

    // Update multiple charts
    ['tideChart', 'tideChartFull'].forEach(id => renderTideChart(id, times, heights, nextHigh));
}

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
    loadTideData();
    setInterval(loadTideData, 60 * 1000);
});
