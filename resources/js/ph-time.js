function updatePHTime() {
    const now = new Date();

    const options = {
        timeZone: 'Asia/Manila',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    const phTimeString = now.toLocaleString('en-PH', options);

    const phTimeElement = document.getElementById('ph-time');
    if (phTimeElement) {
        phTimeElement.textContent = phTimeString;
    }
}

// Update every second
setInterval(updatePHTime, 1000);
updatePHTime();
