// TimeWise Browser Extension Background Script

// Storage keys
const STORAGE_KEYS = {
  ACTIVITIES: 'timewise_activities',
  SETTINGS: 'timewise_settings',
  LAST_REMINDER: 'timewise_last_reminder'
};

// Default settings
const DEFAULT_SETTINGS = {
  hourlyReminders: true,
  workStart: '09:00',
  workEnd: '17:00',
  weekendNotifications: false,
  soundNotifications: true
};

// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
  console.log('TimeWise extension installed');
  
  // Set default settings
  const settings = await getSettings();
  if (!settings) {
    await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: DEFAULT_SETTINGS });
  }
  
  // Set up hourly alarms
  setupHourlyAlarms();
});

// Set up hourly reminder alarms
async function setupHourlyAlarms() {
  // Clear existing alarms
  await chrome.alarms.clearAll();
  
  // Create hourly alarm
  chrome.alarms.create('hourlyReminder', {
    delayInMinutes: 1, // Start in 1 minute for testing
    periodInMinutes: 60 // Repeat every hour
  });
}

// Handle alarm triggers
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'hourlyReminder') {
    await handleHourlyReminder();
  }
});

// Handle hourly reminder
async function handleHourlyReminder() {
  const settings = await getSettings();
  if (!settings || !settings.hourlyReminders) {
    return;
  }
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Check if it's weekend and weekend notifications are disabled
  if ((currentDay === 0 || currentDay === 6) && !settings.weekendNotifications) {
    return;
  }
  
  // Check work hours
  const workStart = parseInt(settings.workStart.split(':')[0]);
  const workEnd = parseInt(settings.workEnd.split(':')[0]);
  
  if (currentHour < workStart || currentHour > workEnd) {
    return;
  }
  
  // Show notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-48.png',
    title: 'TimeWise - Time Check!',
    message: 'What have you been working on? Click to log your activity.',
    buttons: [
      { title: 'Log Activity' },
      { title: 'Skip' }
    ]
  });
}

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  // Open popup when notification is clicked
  chrome.action.openPopup();
  chrome.notifications.clear(notificationId);
});

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) {
    // Log Activity button clicked
    chrome.action.openPopup();
  }
  chrome.notifications.clear(notificationId);
});

// Utility functions
async function getSettings() {
  const result = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
  return result[STORAGE_KEYS.SETTINGS] || DEFAULT_SETTINGS;
}

async function getActivities() {
  const result = await chrome.storage.local.get(STORAGE_KEYS.ACTIVITIES);
  return result[STORAGE_KEYS.ACTIVITIES] || [];
}

async function saveActivity(activity) {
  const activities = await getActivities();
  const newActivity = {
    ...activity,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    url: activity.url || 'unknown'
  };
  
  activities.push(newActivity);
  await chrome.storage.local.set({ [STORAGE_KEYS.ACTIVITIES]: activities });
  
  return newActivity;
}

// Message handling for popup communication
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getActivities') {
    getActivities().then(sendResponse);
    return true;
  }
  
  if (request.action === 'saveActivity') {
    saveActivity(request.activity).then(sendResponse);
    return true;
  }
  
  if (request.action === 'getSettings') {
    getSettings().then(sendResponse);
    return true;
  }
  
  if (request.action === 'updateSettings') {
    chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: request.settings })
      .then(() => {
        setupHourlyAlarms(); // Restart alarms with new settings
        sendResponse({ success: true });
      });
    return true;
  }
});