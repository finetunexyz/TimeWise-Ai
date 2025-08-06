// TimeWise Browser Extension Popup Script

document.addEventListener('DOMContentLoaded', async () => {
    await initializePopup();
    setupEventListeners();
    loadTodaysSummary();
});

// Initialize popup state
async function initializePopup() {
    const currentUrl = await getCurrentTabUrl();
    const urlDisplay = document.getElementById('currentUrl');
    if (urlDisplay) {
        urlDisplay.textContent = currentUrl;
    }
}

// Set up event listeners
function setupEventListeners() {
    // Navigation
    document.getElementById('settingsBtn').addEventListener('click', showSettings);
    document.getElementById('backBtn').addEventListener('click', showMainContent);
    document.getElementById('cancelBtn').addEventListener('click', closePopup);
    
    // Form submission
    document.getElementById('activityForm').addEventListener('submit', handleActivitySubmit);
    document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
    
    // Dashboard link
    document.getElementById('viewDashboardBtn').addEventListener('click', openDashboard);
    
    // Auto-categorization based on description
    document.getElementById('description').addEventListener('input', suggestCategory);
}

// Get current tab URL
async function getCurrentTabUrl() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        return tab?.url || 'Unknown';
    } catch {
        return 'Unknown';
    }
}

// Show/hide sections
function showSettings() {
    document.getElementById('logForm').classList.add('hidden');
    document.getElementById('todaySummary').classList.add('hidden');
    document.getElementById('settingsPanel').classList.remove('hidden');
    loadSettings();
}

function showMainContent() {
    document.getElementById('settingsPanel').classList.add('hidden');
    document.getElementById('logForm').classList.remove('hidden');
    document.getElementById('todaySummary').classList.remove('hidden');
}

// Handle activity form submission
async function handleActivitySubmit(e) {
    e.preventDefault();
    
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value;
    const duration = parseFloat(document.getElementById('duration').value);
    
    if (!description || !category || !duration) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    const now = new Date();
    const startTime = new Date(now.getTime() - (duration * 60 * 60 * 1000));
    const currentUrl = await getCurrentTabUrl();
    
    const activity = {
        description,
        category,
        duration,
        startTime: startTime.toISOString(),
        endTime: now.toISOString(),
        url: currentUrl
    };
    
    try {
        await new Promise((resolve) => {
            chrome.runtime.sendMessage({ action: 'saveActivity', activity }, resolve);
        });
        
        showNotification('Activity saved successfully!', 'success');
        
        // Reset form
        document.getElementById('activityForm').reset();
        
        // Refresh summary
        loadTodaysSummary();
        
        // Close popup after short delay
        setTimeout(() => {
            window.close();
        }, 1500);
        
    } catch (error) {
        console.error('Error saving activity:', error);
        showNotification('Failed to save activity', 'error');
    }
}

// Auto-suggest category based on description
function suggestCategory() {
    const description = document.getElementById('description').value.toLowerCase();
    const categorySelect = document.getElementById('category');
    
    if (!description || categorySelect.value) return;
    
    let suggestedCategory = '';
    
    if (description.includes('work') || description.includes('project') || description.includes('meeting') || 
        description.includes('code') || description.includes('develop') || description.includes('email')) {
        suggestedCategory = 'work';
    } else if (description.includes('learn') || description.includes('study') || description.includes('course') || 
               description.includes('read') || description.includes('research')) {
        suggestedCategory = 'learning';
    } else if (description.includes('gym') || description.includes('exercise') || description.includes('health') || 
               description.includes('workout') || description.includes('doctor') || description.includes('medical')) {
        suggestedCategory = 'health';
    } else if (description.includes('game') || description.includes('movie') || description.includes('tv') || 
               description.includes('relax') || description.includes('entertainment') || description.includes('music')) {
        suggestedCategory = 'leisure';
    } else if (description.includes('family') || description.includes('friend') || description.includes('personal') || 
               description.includes('shopping') || description.includes('cleaning')) {
        suggestedCategory = 'personal';
    }
    
    if (suggestedCategory) {
        categorySelect.value = suggestedCategory;
    }
}

// Load and display settings
async function loadSettings() {
    try {
        const settings = await new Promise((resolve) => {
            chrome.runtime.sendMessage({ action: 'getSettings' }, resolve);
        });
        
        document.getElementById('hourlyReminders').checked = settings.hourlyReminders;
        document.getElementById('weekendNotifications').checked = settings.weekendNotifications;
        document.getElementById('soundNotifications').checked = settings.soundNotifications;
        document.getElementById('workStart').value = settings.workStart;
        document.getElementById('workEnd').value = settings.workEnd;
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Save settings
async function saveSettings() {
    const settings = {
        hourlyReminders: document.getElementById('hourlyReminders').checked,
        weekendNotifications: document.getElementById('weekendNotifications').checked,
        soundNotifications: document.getElementById('soundNotifications').checked,
        workStart: document.getElementById('workStart').value,
        workEnd: document.getElementById('workEnd').value
    };
    
    try {
        await new Promise((resolve) => {
            chrome.runtime.sendMessage({ action: 'updateSettings', settings }, resolve);
        });
        
        showNotification('Settings saved successfully!', 'success');
        showMainContent();
    } catch (error) {
        console.error('Error saving settings:', error);
        showNotification('Failed to save settings', 'error');
    }
}

// Load today's activities summary
async function loadTodaysSummary() {
    try {
        const activities = await new Promise((resolve) => {
            chrome.runtime.sendMessage({ action: 'getActivities' }, resolve);
        });
        
        const today = new Date().toDateString();
        const todayActivities = activities.filter(activity => 
            new Date(activity.createdAt).toDateString() === today
        );
        
        displaySummary(todayActivities);
    } catch (error) {
        console.error('Error loading activities:', error);
        document.getElementById('summaryContent').innerHTML = 
            '<p class="loading">Failed to load activities</p>';
    }
}

// Display activities summary
function displaySummary(activities) {
    const summaryContent = document.getElementById('summaryContent');
    
    if (activities.length === 0) {
        summaryContent.innerHTML = '<p class="loading">No activities logged today</p>';
        return;
    }
    
    // Calculate category totals
    const categoryTotals = activities.reduce((acc, activity) => {
        acc[activity.category] = (acc[activity.category] || 0) + activity.duration;
        return acc;
    }, {});
    
    const totalTime = activities.reduce((sum, activity) => sum + activity.duration, 0);
    
    let html = `<div class="summary-item">
        <span><strong>Total Time:</strong></span>
        <span>${formatDuration(totalTime)}</span>
    </div>`;
    
    Object.entries(categoryTotals).forEach(([category, duration]) => {
        html += `<div class="summary-item">
            <span class="category-tag category-${category}">${category}</span>
            <span>${formatDuration(duration)}</span>
        </div>`;
    });
    
    summaryContent.innerHTML = html;
}

// Format duration for display
function formatDuration(hours) {
    if (hours === 0) return '0 hours';
    if (hours < 1) {
        const minutes = Math.round(hours * 60);
        return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    let result = `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}`;
    if (minutes > 0) {
        result += ` ${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
    return result;
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Open dashboard (could link to web app or extension dashboard)
function openDashboard() {
    chrome.tabs.create({ 
        url: chrome.runtime.getURL('dashboard.html') 
    });
}

// Close popup
function closePopup() {
    window.close();
}