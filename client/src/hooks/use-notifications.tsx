import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isEnabled, setIsEnabled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
      setIsEnabled(Notification.permission === "granted");
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        setPermission(permission);
        setIsEnabled(permission === "granted");
        
        if (permission === "granted") {
          toast({
            title: "Notifications enabled",
            description: "You'll receive hourly reminders to log your activities.",
          });
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    }
  }, [toast]);

  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);

      return notification;
    }
  }, []);

  const showActivityReminder = useCallback(() => {
    const currentHour = new Date().getHours();
    const timeString = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    showNotification("Time Check!", {
      body: `It's ${timeString}. What have you been working on?`,
      tag: "activity-reminder",
      requireInteraction: true,
    });
  }, [showNotification]);

  const scheduleHourlyReminders = useCallback(() => {
    if (!isEnabled) return;

    // Clear any existing intervals
    const existingInterval = window.hourlyReminderInterval;
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    // Calculate time until next hour
    const now = new Date();
    const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0);
    const timeUntilNextHour = nextHour.getTime() - now.getTime();

    // Set initial timeout to sync with the hour
    setTimeout(() => {
      showActivityReminder();
      
      // Then set hourly interval
      const interval = setInterval(() => {
        showActivityReminder();
      }, 60 * 60 * 1000); // 1 hour

      // Store interval globally so it can be cleared
      (window as any).hourlyReminderInterval = interval;
    }, timeUntilNextHour);

  }, [isEnabled, showActivityReminder]);

  useEffect(() => {
    if (isEnabled) {
      scheduleHourlyReminders();
    }

    return () => {
      const interval = (window as any).hourlyReminderInterval;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isEnabled, scheduleHourlyReminders]);

  return {
    permission,
    isEnabled,
    requestPermission,
    showNotification,
    showActivityReminder,
  };
}
