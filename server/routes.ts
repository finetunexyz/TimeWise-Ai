import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertActivitySchema, insertSettingsSchema } from "@shared/schema";
import { suggestCategory, generateProductivityInsights } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Activity routes
  app.post("/api/activities", async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      
      // For demo purposes, we'll use a default userId
      const userId = "demo-user";
      
      const activity = await storage.createActivity({
        ...validatedData,
        userId,
      });
      
      res.json(activity);
    } catch (error) {
      res.status(400).json({ message: "Invalid activity data", error: error.message });
    }
  });

  app.get("/api/activities", async (req, res) => {
    try {
      const userId = "demo-user";
      const date = req.query.date as string;
      
      const activities = await storage.getActivities(userId, date);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities", error: error.message });
    }
  });

  app.get("/api/activities/range", async (req, res) => {
    try {
      const userId = "demo-user";
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      
      const activities = await storage.getActivitiesByDateRange(
        userId,
        startDate as string,
        endDate as string
      );
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities", error: error.message });
    }
  });

  // AI categorization route
  app.post("/api/categorize", async (req, res) => {
    try {
      const { description } = req.body;
      
      if (!description) {
        return res.status(400).json({ message: "Description is required" });
      }
      
      const suggestion = await suggestCategory(description);
      res.json(suggestion);
    } catch (error) {
      res.status(500).json({ message: "Failed to categorize activity", error: error.message });
    }
  });

  // Analytics routes
  app.get("/api/analytics/insights", async (req, res) => {
    try {
      const userId = "demo-user";
      const activities = await storage.getActivities(userId);
      
      const insights = await generateProductivityInsights(activities);
      res.json({ insights });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate insights", error: error.message });
    }
  });

  app.get("/api/analytics/stats", async (req, res) => {
    try {
      const userId = "demo-user";
      const date = req.query.date as string;
      
      const activities = await storage.getActivities(userId, date);
      
      const stats = {
        totalTime: activities.reduce((sum, activity) => sum + activity.duration, 0),
        workTime: activities.filter(a => a.category === 'work').reduce((sum, activity) => sum + activity.duration, 0),
        personalTime: activities.filter(a => a.category === 'personal').reduce((sum, activity) => sum + activity.duration, 0),
        healthTime: activities.filter(a => a.category === 'health').reduce((sum, activity) => sum + activity.duration, 0),
        learningTime: activities.filter(a => a.category === 'learning').reduce((sum, activity) => sum + activity.duration, 0),
        leisureTime: activities.filter(a => a.category === 'leisure').reduce((sum, activity) => sum + activity.duration, 0),
        productivityScore: Math.min(100, Math.round(
          (activities.filter(a => ['work', 'learning'].includes(a.category)).reduce((sum, activity) => sum + activity.duration, 0) / Math.max(1, activities.reduce((sum, activity) => sum + activity.duration, 0))) * 100
        )),
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate stats", error: error.message });
    }
  });

  // Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const userId = "demo-user";
      
      let settings = await storage.getSettings(userId);
      if (!settings) {
        settings = await storage.createSettings({
          userId,
          hourlyReminders: "true",
          weekendNotifications: "false", 
          soundNotifications: "true",
          workStart: "09:00",
          workEnd: "17:00",
          aiCategorization: "true",
          aiInsights: "true",
          aiSuggestions: "true",
        });
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings", error: error.message });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const userId = "demo-user";
      const validatedData = insertSettingsSchema.parse(req.body);
      
      const settings = await storage.updateSettings(userId, validatedData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Invalid settings data", error: error.message });
    }
  });

  // Export data route
  app.get("/api/export", async (req, res) => {
    try {
      const userId = "demo-user";
      const { format = "json" } = req.query;
      
      const activities = await storage.getActivities(userId);
      const settings = await storage.getSettings(userId);
      
      const exportData = {
        activities,
        settings,
        exportedAt: new Date().toISOString(),
      };
      
      if (format === "csv") {
        let csv = "Date,Description,Category,Duration,StartTime,EndTime\n";
        activities.forEach(activity => {
          csv += `${new Date(activity.startTime).toLocaleDateString()},${activity.description},${activity.category},${activity.duration},${activity.startTime},${activity.endTime}\n`;
        });
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="timetracker-export.csv"');
        res.send(csv);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="timetracker-export.json"');
        res.json(exportData);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to export data", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
