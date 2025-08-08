// Discount window configurations focused on Jakarta
const discountWindows = {
    jakarta: {
        name: "Jakarta",
        timezone: "Asia/Jakarta",
        utcOffset: 7,
        utcStart: 16, // 16:00 UTC = 11 PM Jakarta
        utcEnd: 1,    // 01:00 UTC = 8 AM Jakarta (next day)
        localStart: "11:00 PM",
        localEnd: "8:00 AM"
    },
    london: {
        name: "London", 
        timezone: "Europe/London",
        utcOffset: 1,
        utcStart: 0,  // 00:00 UTC = 1 AM London
        utcEnd: 8,    // 08:00 UTC = 9 AM London
        localStart: "1:00 AM",
        localEnd: "9:00 AM"
    },
    newyork: {
        name: "New York",
        timezone: "America/New_York",
        utcOffset: -4, // EDT
        utcStart: 1,  // 01:00 UTC = 9 PM NY (prev day)
        utcEnd: 9,    // 09:00 UTC = 5 AM NY
        localStart: "9:00 PM",
        localEnd: "5:00 AM"
    }
};

function updateTime() {
    const now = new Date();
    
    // Update header time (Jakarta time)
    const jakartaTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jakarta',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(now);
    
    document.getElementById('current-time-display').textContent = jakartaTime;
    
    // Update all local times
    updateRegionTime('jakarta', 'Asia/Jakarta');
    updateRegionTime('london', 'Europe/London');
    updateRegionTime('newyork', 'America/New_York');
    
    // Update status and timeline
    updateDiscountStatus();
    updateTimeline();
}

function updateRegionTime(region, timezone) {
    const now = new Date();
    const timeElement = document.getElementById(`${region}-time`);
    
    const localTime = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(now);
    
    timeElement.textContent = localTime;
}

function isDiscountActive(region) {
    const now = new Date();
    const utcHour = now.getUTCHours();
    const window = discountWindows[region];
    
    if (window.utcEnd < window.utcStart) {
        // Window crosses midnight UTC
        return utcHour >= window.utcStart || utcHour < window.utcEnd;
    } else {
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
            
        statusElement.querySelector('.status-text').textContent = statusText;
    });
}

function updateTimeline() {
    const now = new Date();
    const utcHour = now.getUTCHours();
    const utcMinute = now.getUTCMinutes();
    
    // Update current time marker position (24-hour format)
    const markerPosition = ((utcHour * 60 + utcMinute) / (24 * 60)) * 100;
    document.getElementById('time-marker').style.left = `${markerPosition}%`;
    
    // Update timeline bars for each region
    Object.keys(discountWindows).forEach(region => {
        const bar = document.getElementById(`${region}-timeline`);
        const window = discountWindows[region];
        
        let startPercent, widthPercent;
        
        if (window.utcEnd < window.utcStart) {
            // Window crosses midnight
            startPercent = (window.utcStart / 24) * 100;
            widthPercent = ((24 - window.utcStart + window.utcEnd) / 24) * 100;
        } else {
            startPercent = (window.utcStart / 24) * 100;
            widthPercent = ((window.utcEnd - window.utcStart) / 24) * 100;
        }
        
        bar.style.left = `${startPercent}%`;
        bar.style.width = `${widthPercent}%`;
    });
}

// Initialize
updateTime();
setInterval(updateTime, 1000);

// Set initial timeline bar positions
document.addEventListener('DOMContentLoaded', updateTimeline);