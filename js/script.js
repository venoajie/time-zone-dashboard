// Discount window configurations focused on Jakarta
const discountWindows = {
    jakarta: {
        name: "Jakarta",
        timezone: "Asia/Jakarta",
        utcStart: 16, // 16:00 UTC = 11 PM Jakarta (next day)
        utcEnd: 1,    // 01:00 UTC = 8 AM Jakarta (next day)
        localStart: "11:00 PM",
        localEnd: "8:00 AM"
    },
    london: {
        name: "London", 
        timezone: "Europe/London",
        utcStart: 0,  // 00:00 UTC = 1 AM London
        utcEnd: 8,    // 08:00 UTC = 9 AM London
        localStart: "1:00 AM",
        localEnd: "9:00 AM"
    },
    newyork: {
        name: "New York",
        timezone: "America/New_York",
        utcStart: 1,  // 01:00 UTC = 9 PM NY (previous day)
        utcEnd: 9,    // 09:00 UTC = 5 AM NY
        localStart: "9:00 PM",
        localEnd: "5:00 AM"
    }
};

function updateCurrentTime() {
    const now = new Date();
    
    // Update header time (Jakarta time)
    const jakartaTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jakarta',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(now);
    
    const jakartaDay = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jakarta',
        weekday: 'long'
    }).format(now);
    
    document.getElementById('current-time-display').textContent = jakartaTime;
    document.querySelector('.day-indicator').textContent = jakartaDay;
}

function updateRegionTimes() {
    const now = new Date();
    
    // Jakarta
    const jakartaTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jakarta',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(now);
    document.getElementById('jakarta-time').textContent = jakartaTime;
    
    // London
    const londonTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/London',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(now);
    document.getElementById('london-time').textContent = londonTime;
    
    // New York
    const nyTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(now);
    document.getElementById('newyork-time').textContent = nyTime;
}

function isDiscountActive(region) {
    const now = new Date();
    const utcHour = now.getUTCHours();
    const window = discountWindows[region];
    
    if (window.utcEnd < window.utcStart) {
        // Window crosses midnight UTC (like Jakarta and NY)
        return utcHour >= window.utcStart || utcHour < window.utcEnd;
    } else {
        // Normal window (like London)
        return utcHour >= window.utcStart && utcHour < window.utcEnd;
    }
}

function updateDiscountStatus() {
    Object.keys(discountWindows).forEach(region => {
        const statusElement = document.getElementById(`${region}-status`);
        const isActive = isDiscountActive(region);
        const regionName = discountWindows[region].name.toUpperCase();
        
        const statusText = isActive 
            ? `${regionName} DISCOUNT OPEN`
            : `${regionName} DISCOUNT CLOSED`;
            
        if (statusElement && statusElement.querySelector('.status-text')) {
            statusElement.querySelector('.status-text').textContent = statusText;
        }
        
        // Update visual styling based on current status
        const regionRow = document.querySelector(`[data-region="${region}"]`);
        if (regionRow) {
            const statusDiv = regionRow.querySelector('.session-status');
            statusDiv.className = 'session-status';
            
            if (isActive) {
                statusDiv.classList.add('status-active');
            } else {
                statusDiv.classList.add('status-inactive');
            }
        }
    });
}

function updateTimeline() {
    const now = new Date();
    const utcHour = now.getUTCHours();
    const utcMinute = now.getUTCMinutes();
    
    // Update current time marker position (24-hour format)
    const markerPosition = ((utcHour * 60 + utcMinute) / (24 * 60)) * 100;
    const marker = document.getElementById('time-marker');
    if (marker) {
        marker.style.left = `${markerPosition}%`;
    }
    
    // Update timeline bars for each region
    Object.keys(discountWindows).forEach(region => {
        const bar = document.getElementById(`${region}-timeline`);
        if (!bar) return;
        
        const window = discountWindows[region];
        let startPercent, widthPercent;
        
        if (window.utcEnd < window.utcStart) {
            // Window crosses midnight (Jakarta: 16-24 + 0-1, NY: 1-9)
            if (region === 'jakarta') {
                // Jakarta: 16:00-00:00 UTC (8 hours)
                startPercent = (16 / 24) * 100;
                widthPercent = (8 / 24) * 100;
            } else if (region === 'newyork') {
                // NY: 01:00-09:00 UTC (8 hours) 
                startPercent = (1 / 24) * 100;
                widthPercent = (8 / 24) * 100;
            }
        } else {
            // London: 00:00-08:00 UTC (8 hours)
            startPercent = (window.utcStart / 24) * 100;
            widthPercent = ((window.utcEnd - window.utcStart) / 24) * 100;
        }
        
        bar.style.left = `${startPercent}%`;
        bar.style.width = `${widthPercent}%`;
        
        // Update opacity based on active status
        if (isDiscountActive(region)) {
            bar.style.opacity = '1';
            bar.style.boxShadow = '0 2px 8px rgba(22, 163, 74, 0.3)';
        } else {
            bar.style.opacity = '0.3';
            bar.style.boxShadow = 'none';
        }
    });
}

function updateAll() {
    updateCurrentTime();
    updateRegionTimes();
    updateDiscountStatus();
    updateTimeline();
    
    // Debug log
    console.log('Dashboard updated:', new Date().toISOString());
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initializing...');
    updateAll();
    
    // Update every second
    setInterval(updateAll, 1000);
});

// Fallback initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAll);
} else {
    updateAll();
}