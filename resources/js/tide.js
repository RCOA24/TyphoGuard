function findNextHighTide(times, heights) {
    const now = new Date();
    for (let i = 1; i < heights.length - 1; i++) {
        const tideTime = new Date(times[i]);
        if (tideTime > now && heights[i] > heights[i - 1] && heights[i] > heights[i + 1]) {
            return { time: tideTime, height: heights[i], index: i };
        }
    }
    return null;
}

function findNextLowTide(times, heights) {
    const now = new Date();
    for (let i = 1; i < heights.length - 1; i++) {
        const tideTime = new Date(times[i]);
        if (tideTime > now && heights[i] < heights[i - 1] && heights[i] < heights[i + 1]) {
            return { time: tideTime, height: heights[i], index: i };
        }
    }
    return null;
}

function formatTime12(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

async function loadTideData() {
    try {
        const response = await fetch(
            'https://marine-api.open-meteo.com/v1/marine?latitude=14.556&longitude=120.98&hourly=sea_level_height_msl&timezone=Asia/Manila'
        );
        const data = await response.json();
        const times = data.hourly.time;
        const heights = data.hourly.sea_level_height_msl;

        // Get next high & low tide
        const nextHigh = findNextHighTide(times, heights);
        const nextLow = findNextLowTide(times, heights);

        // Update Blade cards dynamically
            if (nextHigh) {
            const now = new Date();
            const diffMs = nextHigh.time - now;
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            // --- Dashboard (KPI + Next High Line) ---
            const kpiEl = document.querySelector('.kpi');
            if (kpiEl) {
                kpiEl.textContent = `High in ${diffHours}h ${diffMinutes}m`;
            }

            const nextHighEl = document.querySelector('.next-high');
            if (nextHighEl) {
                nextHighEl.textContent = `Next high: ${nextHigh.height.toFixed(2)} m @ ${formatTime12(nextHigh.time)}`;
            }

            // --- Tide Section (Card for Next High) ---
            const elValue = document.getElementById('next-high-value');
            const elTime = document.getElementById('next-high-time');
            if (elValue) elValue.textContent = `${nextHigh.height.toFixed(2)} m (in ${diffHours}h ${diffMinutes}m)`;
            if (elTime) elTime.textContent = formatTime12(nextHigh.time);
        }


// Update Blade cards dynamically for next low tide
if (nextLow) {
    const now = new Date();
    const diffMs = nextLow.time - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    // --- Dashboard (KPI + Next Low Line) ---
    const nextLowKpiEl = document.querySelector('.kpi-low');
    if (nextLowKpiEl) {
        nextLowKpiEl.textContent = `Low in ${diffHours}h ${diffMinutes}m`;
    }

    const nextLowEl = document.querySelector('.next-low');
    if (nextLowEl) {
        nextLowEl.textContent = `Next low: ${nextLow.height.toFixed(2)} m @ ${formatTime12(nextLow.time)}`;
    }

    // --- Tide Section (Card for Next Low) ---
    const elValueLow = document.getElementById('next-low-value');
    const elTimeLow = document.getElementById('next-low-time');
    if (elValueLow) elValueLow.textContent = `${nextLow.height.toFixed(2)} m (in ${diffHours}h ${diffMinutes}m)`;
    if (elTimeLow) elTimeLow.textContent = formatTime12(nextLow.time);
}



            // Daily range = max - min
            const todayLevels = heights.slice(0, 24); // first 24 hours
            const maxLevel = Math.max(...todayLevels);
            const minLevel = Math.min(...todayLevels);
            const rangeEl = document.getElementById('tide-range');
            if (rangeEl) rangeEl.textContent = `${(maxLevel - minLevel).toFixed(2)} m`;


        // Optional: Chart rendering (reuse your existing chart code)
        const pointColors = heights.map((h, i) => (nextHigh && i === nextHigh.index ? 'red' : '#0284c7'));
        const pointSizes = heights.map((h, i) => (nextHigh && i === nextHigh.index ? 6 : 3));
        const formattedTimes = times.map(t => formatTime12(new Date(t)));

        const chartData = {
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
        };

        const chartOptions = {
            responsive: true,
            animation: { duration: 2000, easing: 'easeInOutQuad' },
            plugins: { legend: { display: false } },
            scales: { x: { ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 12 } }, y: { beginAtZero: false } }
        };

        ['tideChart', 'tideChartFull'].forEach(id => {
            const ctx = document.getElementById(id);
            if (ctx) new Chart(ctx.getContext('2d'), { type: 'line', data: chartData, options: chartOptions });
        });

    } catch (err) {
        console.error('Error fetching tide data:', err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial load
    loadTideData();

    // Refresh every 60 seconds (1 minute)
    setInterval(loadTideData, 60 * 1000);
});