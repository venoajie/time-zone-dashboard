// Simple time update function that definitely works
function updateTime() {
    const now = new Date();
    
    // Jakarta time for header
    const jakartaOptions = {
        timeZone: 'Asia/Jakarta',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    const jakartaTime = now.toLocaleString('en-US', jakartaOptions);
    
    // Update header time
    const headerTime = document.getElementById('current-time-display');
    if (headerTime) {
        headerTime.textContent = jakartaTime;
    }
    
    // Update day
    const dayOptions = {
        timeZone: 'Asia/Jakarta',
        weekday: 'long'
    };
    const jakartaDay = now.toLocaleString('en-US', dayOptions);
    const dayElement = document.querySelector('.day-indicator');
    if (dayElement) {
        dayElement.textContent = jakartaDay;
    }
    
    // Update Jakarta time in table
    const jakartaTableTime = document.getElementById('jakarta-time');
    if (jakartaTableTime) {
        jakartaTableTime.textContent = jakartaTime;
    }
    
    // Update London time
    const londonOptions = {
        timeZone: 'Europe/London',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    const londonTime = now.toLocaleString('en-US', londonOptions);
    const londonTableTime = document.getElementById('london-time');
    if (londonTableTime) {
        londonTableTime.textContent = londonTime;
    }
    
    // Update New York time
    const nyOptions = {
        timeZone: 'America/New_York',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    const nyTime = now.toLocaleString('en-US', nyOptions);
    const nyTableTime = document.getElementById('newyork-time');
    if (nyTableTime) {
        nyTableTime.textContent = nyTime;
    }
    
    // Update discount status and timeline
    updateStatus();
    updateTimeline();
    
    // Console log for debugging
    console.log('Time updated:', jakartaTime);
}

function updateStatus() {
    const now = new Date();
    const utcHour = now.getUTCHours();
    
    // Jakarta: 16:00-01:00 UTC (11 PM - 8 AM Jakarta time)
    const jakartaActive = utcHour >= 16 || utcHour < 1;
    
    // London: 00:00-08:00 UTC (1 AM - 9 AM London time)  
    const londonActive = utcHour >= 0 && utcHour < 8;
    
    // New York: 01:00-09:00 UTC (9 PM - 5 AM NY time)
    const nyActive = utcHour >= 1 && utcHour < 9;
    
    // Update Jakarta status
    const jakartaStatus = document.getElementById('jakarta-status');
    if (jakartaStatus) {
        const statusText = jakartaActive ? 'JAKARTA DISCOUNT OPEN' : 'JAKARTA DISCOUNT CLOSED';
        jakartaStatus.querySelector('.status-text').textContent = statusText;
        jakartaStatus.className = jakartaActive ? 'session-status status-active' : 'session-status status-inactive';
    }
    
    // Update London status
    const londonStatus = document.getElementById('london-status');
    if (londonStatus) {
        const statusText = londonActive ? 'LONDON DISCOUNT OPEN' : 'LONDON DISCOUNT CLOSED';
        londonStatus.querySelector('.status-text').textContent = statusText;
        londonStatus.className = londonActive ? 'session-status status-active' : 'session-status status-inactive';
    }
    
    // Update New York status
    const nyStatus = document.getElementById('newyork-status');
    if (nyStatus) {
        const statusText = nyActive ? 'NEW YORK DISCOUNT OPEN' : 'NEW YORK DISCOUNT CLOSED';
        nyStatus.querySelector('.status-text').textContent = statusText;
        nyStatus.className = nyActive ? 'session-status status-active' : 'session-status status-inactive';
    }
    
    console.log(`UTC: ${utcHour}:${utcMinute} | Jakarta: ${jakartaActive} | London: ${londonActive} | NY: ${nyActive}`);
}

function updateTimeline() {
    const now = new Date();
    const utcHour = now.getUTCHours();
    const utcMinute = now.getUTCMinutes();
    
    // Update current time marker position
    const markerPosition = ((utcHour * 60 + utcMinute) / (24 * 60)) * 100;
    const marker = document.getElementById('time-marker');
    if (marker) {
        marker.style.left = `${markerPosition}%`;
        console.log(`Marker position: ${markerPosition}%`);
    }
    
    // Update bar states based on current UTC time
    const jakartaActive = utcHour >= 16 || utcHour < 1;
    const londonActive = utcHour >= 0 && utcHour < 8;
    const nyActive = utcHour >= 1 && utcHour < 9;
    
    // Jakarta bar
    const jakartaBar = document.getElementById('jakarta-timeline');
    if (jakartaBar) {
        jakartaBar.className = jakartaActive ? 'timeline-bar jakarta-bar active' : 'timeline-bar jakarta-bar inactive';
        console.log('Jakarta bar updated:', jakartaActive);
    }
    
    // London bar  
    const londonBar = document.getElementById('london-timeline');
    if (londonBar) {
        londonBar.className = londonActive ? 'timeline-bar london-bar active' : 'timeline-bar london-bar inactive';
        console.log('London bar updated:', londonActive);
    }
    
    // New York bar
    const nyBar = document.getElementById('newyork-timeline');
    if (nyBar) {
        nyBar.className = nyActive ? 'timeline-bar newyork-bar active' : 'timeline-bar newyork-bar inactive';
        console.log('NY bar updated:', nyActive);
    }
}

// Start immediately when script loads
console.log('Starting dashboard...');
updateTime();

// Update every 1 second
setInterval(updateTime, 1000);

// Also update when page loads
window.addEventListener('load', updateTime);
document.addEventListener('DOMContentLoaded', updateTime);