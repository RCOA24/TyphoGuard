function findNextHighTide(times, heights) {
    const now = new Date();

    for (let i = 1; i < heights.length - 1; i++) {
        let tideTime = new Date(times[i]);
        if (
            tideTime > now &&
            heights[i] > heights[i - 1] &&
            heights[i] > heights[i + 1]
        ) {
            return { time: tideTime, height: heights[i], index: i };
        }
    }
    return null;
}

async function loadTideData() {
    const response = await fetch(
        'https://marine-api.open-meteo.com/v1/marine?latitude=14.556&longitude=120.98&hourly=sea_level_height_msl&timezone=Asia/Manila'
    );
    const data = await response.json();

    const times = data.hourly.time;
    const heights = data.hourly.sea_level_height_msl;

    // Update KPI if present
    const kpiEl = document.querySelector('.kpi');
    const nextHighEl = document.querySelector('.next-high');
    const nextHigh = findNextHighTide(times, heights);

    if (nextHigh && kpiEl && nextHighEl) {
        const now = new Date();
        const diffMs = nextHigh.time - now;
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs / (1000 * 60)) % 60);

        kpiEl.textContent = `High in ${diffHrs}h ${diffMins}m`;
        nextHighEl.textContent =
            `Next high: ${nextHigh.height.toFixed(2)} m @ ${nextHigh.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Highlight next high tide point in red and make it pulse
    const pointColors = heights.map((h, i) => (nextHigh && i === nextHigh.index ? 'red' : '#0284c7'));
    const pointSizes = heights.map((h, i) => (nextHigh && i === nextHigh.index ? 6 : 3));

    // Format times neatly for UI/UX
    const formattedTimes = times.map(t => {
        const date = new Date(t);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 === 0 ? 12 : hours % 12;
        return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    });

    // Chart data config
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
        animation: {
            duration: 2000,
            easing: 'easeInOutQuad'
        },
        plugins: { legend: { display: false } },
        scales: {
            x: {
                ticks: {
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 12 // show max 12 labels
                }
            },
            y: { beginAtZero: false }
        }
    };

    // Render chart in dashboard if exists
    const ctxDashboard = document.getElementById('tideChart');
    if (ctxDashboard) {
        new Chart(ctxDashboard.getContext('2d'), {
            type: 'line',
            data: chartData,
            options: chartOptions
        });
    }

    // Render chart in index.blade.php if exists
    const ctxFull = document.getElementById('tideChartFull');
    if (ctxFull) {
        new Chart(ctxFull.getContext('2d'), {
            type: 'line',
            data: chartData,
            options: chartOptions
        });
    }
}

// Ensure DOM is ready
document.addEventListener('DOMContentLoaded', loadTideData);
