import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)}m`;
  }
  return `${hours.toFixed(1)}h`;
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getCategoryColor(category: string): string {
  const colors = {
    work: "hsl(142, 76%, 36%)", // emerald-600
    personal: "hsl(262, 83%, 58%)", // purple-500
    health: "hsl(0, 84%, 60%)", // red-500
    learning: "hsl(43, 96%, 56%)", // yellow-500
    leisure: "hsl(207, 90%, 54%)", // blue-500
  };
  return colors[category as keyof typeof colors] || "hsl(220, 13%, 69%)"; // gray-400
}

export function getCategoryIcon(category: string): string {
  const icons = {
    work: "fas fa-briefcase",
    personal: "fas fa-user",
    health: "fas fa-heart",
    learning: "fas fa-graduation-cap",
    leisure: "fas fa-gamepad",
  };
  return icons[category as keyof typeof icons] || "fas fa-circle";
}

export function calculateProductivityScore(activities: any[]): number {
  if (activities.length === 0) return 0;
  
  const totalTime = activities.reduce((sum, activity) => sum + activity.duration, 0);
  const productiveTime = activities
    .filter(activity => ['work', 'learning'].includes(activity.category))
    .reduce((sum, activity) => sum + activity.duration, 0);
  
  return Math.round((productiveTime / totalTime) * 100);
}
