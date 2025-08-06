import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "@/lib/queryClient";

interface NotificationSettings {
  hourlyReminders: boolean;
  workStart: string;
  workEnd: string;
  weekendNotifications: boolean;
  soundNotifications: boolean;
}

export function useHourlyNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === "granted";
    }
    return false;
  }, []);

  // Load user settings
  const loadSettings = useCallback(async () => {
    try {
      const response = await apiRequest("GET", "/api/settings");
      const data = await response.json();
      setSettings({
        hourlyReminders: data.hourlyReminders === "true",
        workStart: data.workStart || "09:00",
        workEnd: data.workEnd || "17:00",
        weekendNotifications: data.weekendNotifications === "true",
        soundNotifications: data.soundNotifications === "true",
      });
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  }, []);

  // Check if current time is within work hours
  const isWorkHours = useCallback(() => {
    if (!settings) return true;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    const [startHour, startMinute] = settings.workStart.split(':').map(Number);
    const [endHour, endMinute] = settings.workEnd.split(':').map(Number);
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    
    return currentTime >= startTime && currentTime <= endTime;
  }, [settings]);

  // Check if it's a weekend
  const isWeekend = useCallback(() => {
    const day = new Date().getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }, []);

  // Should show notification based on settings
  const shouldShowNotification = useCallback(() => {
    if (!settings || !settings.hourlyReminders) return false;
    if (isWeekend() && !settings.weekendNotifications) return false;
    if (!isWorkHours() && !isWeekend()) return false;
    return true;
  }, [settings, isWeekend, isWorkHours]);

  // Show browser notification
  const showBrowserNotification = useCallback(() => {
    if (permission !== "granted" || !shouldShowNotification()) return;

    const notification = new Notification("TimeWise - Time Check!", {
      body: "What have you been working on? Log your activity now.",
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: "timewise-hourly",
      requireInteraction: true,
    });

    notification.onclick = () => {
      window.focus();
      setIsNotificationVisible(true);
      notification.close();
    };

    // Auto-close after 30 seconds if not interacted with
    setTimeout(() => {
      notification.close();
    }, 30000);

    return notification;
  }, [permission, shouldShowNotification]);

  // Show in-app notification popup
  const showInAppNotification = useCallback(() => {
    if (!shouldShowNotification()) return;
    
    setIsNotificationVisible(true);
    
    // Play sound if enabled
    if (settings?.soundNotifications) {
      // Create a simple notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  }, [shouldShowNotification, settings]);

  // Schedule next hourly notification
  const scheduleNextNotification = useCallback(() => {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    
    const timeUntilNextHour = nextHour.getTime() - now.getTime();
    
    return setTimeout(() => {
      if (shouldShowNotification()) {
        // Try browser notification first, fallback to in-app
        const browserNotification = showBrowserNotification();
        if (!browserNotification) {
          showInAppNotification();
        }
      }
      
      // Schedule the next notification
      scheduleNextNotification();
    }, timeUntilNextHour);
  }, [shouldShowNotification, showBrowserNotification, showInAppNotification]);

  // Initialize notifications
  useEffect(() => {
    loadSettings();
    
    // Request permission on first load
    if (permission === "default") {
      requestPermission();
    }
  }, [loadSettings, requestPermission, permission]);

  // Start hourly notifications when settings are loaded
  useEffect(() => {
    if (!settings) return;

    let timeoutId: NodeJS.Timeout;
    
    // Only start notifications if enabled
    if (settings.hourlyReminders) {
      timeoutId = scheduleNextNotification();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [settings, scheduleNextNotification]);

  return {
    permission,
    requestPermission,
    isNotificationVisible,
    setIsNotificationVisible,
    showInAppNotification,
    settings,
    loadSettings,
  };
}