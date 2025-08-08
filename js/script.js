// Discount window configurations (in UTC)
const discountWindows = {
    asia: {
        name: "Asia (SG/ID/TH)",
        timezone: "Asia/Singapore",
        utcStart: 16, // 16:00 UTC
        utcEnd: 24,   // 00:00 UTC (next day)
        localStart: "12:00 AM",
        localEnd: "8:00 AM"
    },
    europe: {
        name: "Europe",
        timezone: "Europe/Berlin", 
        utcStart: 0,  // 00:00 UTC
        utcEnd: 8,    // 08:00 UTC
        localStart: "1:00 AM",
        localEnd: "9:00 AM"
    },
    "us-east": {
        name: "US East",
        timezone: "America/New_York",
        utcStart: 1,  // 01:00 UTC
        utcEnd: 9,    // 09:00 UTC
        localStart: "8:00 PM",
        localEnd: "4:00 AM"
    }
};

let notificationsEnabled = false;

function updateTime() {
    const now = new Date();
    const utcTime = now.toUTCString().slice(17, 25);
    document.getElementById('utc-time').textContent = utcTime;
    
    // Update local times
    document.querySelectorAll('.local-time').forEach(element => {
        const timezone = element.getAttribute('data-timezone');
        const localTime = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).format(now);
        element.textContent = localTime;
    });
    
    updateDiscountStatus();
    updateTimeline();
    updateNextOpportunity();
}

function isDiscountActive(region) {
    const now = new Date();
    const utcHour = now.getUTCHours();
    const window = discountWindows[region];
    
    if (region === 'asia') {
        // Asia window crosses midnight UTC
        return utcHour >= window.utcStart || utcHour < 0; // 16:00-23:59 UTC
    } else if (window.utcEnd > window.utcStart) {
        return utcHour >= window.utcStart && utcHour < window.utcEnd;
    } else {
        // Window crosses midnight
        return utcHour >= window.utcStart || utcHour < window.utcEnd;
    }
}

function getTimeUntilNext(region) {
    const now = new Date();
    const utcHour = now.getUTCHours();
    const utcMinute = now.getUTCMinutes();
    const window = discountWindows[region];
    
    let hoursUntil, minutesUntil;
    
    if (isDiscountActive(region)) {
        // Calculate time until window ends
        let endHour = window.utcEnd;
        if (region === 'asia') endHour = 0; // Special case for Asia
        
        if (endHour <= utcHour) endHour += 24;
        hoursUntil = endHour - utcHour;
        minutesUntil = 60 - utcMinute;
        
        if (minutesUntil === 60) {
            minutesUntil = 0;
        } else {
            hoursUntil--;
        }
        
        return `Ends in ${hoursUntil}h ${minutesUntil}m`;
    } else {
        // Calculate time until window starts
        let startHour = window.utcStart;
        if (startHour <= utcHour) startHour += 24;
        
        hoursUntil = startHour - utcHour;
        minutesUntil = 60 - utcMinute;
        
        if (minutesUntil === 60) {
            minutesUntil = 0;
        } else {
            hoursUntil--;
        }
        
        return `Starts in ${hoursUntil}h ${minutesUntil}m`;
    }
}

function updateDiscountStatus() {
    Object.keys(discountWindows).forEach(region => {
        const statusElement = document.getElementById(`${region}-status`);
        const countdownElement = document.getElementById(`${region}-countdown`);
        
        const isActive = isDiscountActive(region);
        const timeInfo = getTimeUntilNext(region);
        
        statusElement.className = 'status-indicator';
        
        if (isActive) {
            statusElement.classList.add('status-active');
            statusElement.textContent = '🟢 DISCOUNT ACTIVE';
        } else {
            statusElement.classList.add('status-closed');
            statusElement.textContent = '🔴 NOT ACTIVE';
        }
        
        countdownElement.textContent = timeInfo;
    });
}

function updateTimeline() {
    const now = new Date();
    const utcHour = now.getUTCHours();
    const utcMinute = now.getUTCMinutes();
    
    // Update current time marker position
    const markerPosition = ((utcHour * 60 + utcMinute) / (24 * 60)) * 100;
    document.getElementById('timeline-marker').style.left = `${markerPosition}%`;
    
    // Update timeline bars
    Object.keys(discountWindows).forEach(region => {
        const bar = document.getElementById(`${region}-bar`);
        const window = discountWindows[region];
        
        let startPercent, widthPercent;
        
        if (region === 'asia') {
            // Asia: 16:00-00:00 UTC (crosses midnight)
            startPercent = (16 / 24) * 100;
            widthPercent = (8 / 24) * 100; // 8 hours
        } else {
            startPercent = (window.utcStart / 24) * 100;
            widthPercent = ((window.utcEnd - window.utcStart) / 24) * 100;
        }
        
        bar.style.left = `${startPercent}%`;
        bar.style.width = `${widthPercent}%`;
        
        // Add active styling
        if (isDiscountActive(region)) {
            bar.style.opacity = '1';
            bar.style.border = '2px solid #fff';
        } else {
            bar.style.opacity = '0.6';
            bar.style.border = 'none';
        }
    });
}

function updateNextOpportunity() {
    const nextOpportunities = [];
    
    Object.keys(discountWindows).forEach(region => {
        const window = discountWindows[region];
        const timeInfo = getTimeUntilNext(region);
        const isActive = isDiscountActive(region);
        
        nextOpportunities.push({
            region: window.name,
            timeInfo,
            isActive,
            sortValue: isActive ? 0 : parseInt(timeInfo.match(/(\d+)h/)?.[1] || 0)
        });
    });
    
    // Sort by active status first, then by time
    nextOpportunities.sort((a, b) => {
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return a.sortValue - b.sortValue;
    });
    
    const next = nextOpportunities[0];
    const opportunityText = next.isActive 
        ? `🟢 ${next.region} is currently active` 
        : `⏰ Next: ${next.region} ${next.timeInfo}`;
    
    document.getElementById('next-opportunity').textContent = opportunityText;
}

function refreshData() {
    updateTime();
    if (notificationsEnabled) {
        showNotification("Dashboard refreshed");
    }
}

function toggleNotifications() {
    notificationsEnabled = !notificationsEnabled;
    const btn = event.target;
    btn.textContent = notificationsEnabled ? '🔔 Notifications ON' : '🔔 Notifications OFF';
    btn.style.background = notificationsEnabled ? '#28a745' : '#667eea';
}

function showNotification(message) {
    if (notificationsEnabled && 'Notification' in window) {
        new Notification('Off-Peak Discount Alert', {
            body: message,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50%" x="50%" text-anchor="middle" dy=".35em" font-size="50">💰</text></svg>'
        });
    }
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Initialize and set up intervals
updateTime();
setInterval(updateTime, 1000);

// Set up the timeline hours
document.addEventListener('DOMContentLoaded', function() {
    const hoursContainer = document.querySelector('.timeline-hours');
    if (hoursContainer && !hoursContainer.hasChildNodes()) {
        for (let i = 0; i < 24; i++) {
            const hourSpan = document.createElement('span');
            hourSpan.textContent = i.toString().padStart(2, '0');
            hoursContainer.appendChild(hourSpan);
        }
    }
});