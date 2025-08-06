import { type User, type InsertUser, type Activity, type InsertActivity, type Settings, type InsertSettings } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Activity methods
  getActivities(userId: string, date?: string): Promise<Activity[]>;
  createActivity(activity: InsertActivity & { userId: string }): Promise<Activity>;
  getActivitiesByDateRange(userId: string, startDate: string, endDate: string): Promise<Activity[]>;
  
  // Settings methods
  getSettings(userId: string): Promise<Settings | undefined>;
  createSettings(settings: InsertSettings & { userId: string }): Promise<Settings>;
  updateSettings(userId: string, settings: Partial<InsertSettings>): Promise<Settings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private activities: Map<string, Activity>;
  private settings: Map<string, Settings>;

  constructor() {
    this.users = new Map();
    this.activities = new Map();
    this.settings = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getActivities(userId: string, date?: string): Promise<Activity[]> {
    const userActivities = Array.from(this.activities.values()).filter(
      (activity) => activity.userId === userId
    );
    
    if (date) {
      const targetDate = new Date(date);
      return userActivities.filter((activity) => {
        const activityDate = new Date(activity.startTime);
        return activityDate.toDateString() === targetDate.toDateString();
      });
    }
    
    return userActivities;
  }

  async createActivity(activityData: InsertActivity & { userId: string }): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = {
      ...activityData,
      id,
      createdAt: new Date(),
    };
    this.activities.set(id, activity);
    return activity;
  }

  async getActivitiesByDateRange(userId: string, startDate: string, endDate: string): Promise<Activity[]> {
    const userActivities = Array.from(this.activities.values()).filter(
      (activity) => activity.userId === userId
    );
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return userActivities.filter((activity) => {
      const activityDate = new Date(activity.startTime);
      return activityDate >= start && activityDate <= end;
    });
  }

  async getSettings(userId: string): Promise<Settings | undefined> {
    return Array.from(this.settings.values()).find(
      (setting) => setting.userId === userId
    );
  }

  async createSettings(settingsData: InsertSettings & { userId: string }): Promise<Settings> {
    const id = randomUUID();
    const settings: Settings = { ...settingsData, id };
    this.settings.set(id, settings);
    return settings;
  }

  async updateSettings(userId: string, settingsData: Partial<InsertSettings>): Promise<Settings> {
    const existing = await this.getSettings(userId);
    if (!existing) {
      return this.createSettings({ ...settingsData, userId } as InsertSettings & { userId: string });
    }
    
    const updated: Settings = { ...existing, ...settingsData };
    this.settings.set(existing.id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
