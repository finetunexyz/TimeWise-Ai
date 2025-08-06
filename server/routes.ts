import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertActivitySchema, insertSettingsSchema } from "@shared/schema";
// Removed OpenAI dependencies

function getMostProductiveCategory(activities: any[]) {
  const categoryHours = activities.reduce((acc, activity) => {
    acc[activity.category] = (acc[activity.category] || 0) + activity.duration;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(categoryHours)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Activity routes
  app.post("/api/activities", async (req, res) => {
    try {
      // Convert string dates to Date objects before validation
      const requestData = {
        ...req.body,
        startTime: req.body.startTime ? new Date(req.body.startTime) : undefined,
        endTime: req.body.endTime ? new Date(req.body.endTime) : undefined,
      };
      
      const validatedData = insertActivitySchema.parse(requestData);
      
      // For demo purposes, we'll use a default userId
      const userId = "demo-user";
      
      const activity = await storage.createActivity({
        ...validatedData,
        userId,
      });
      
      res.json(activity);
    } catch (error) {
      console.error("Failed to create activity:", error);
      res.status(400).json({ message: "Invalid activity data", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get("/api/activities", async (req, res) => {
    try {
      const userId = "demo-user";
      const date = req.query.date as string;
      
      const activities = await storage.getActivities(userId, date);
      res.json(activities);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      res.status(500).json({ message: "Failed to fetch activities", error: error instanceof Error ? error.message : String(error) });
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
      console.error("Failed to fetch activities by range:", error);
      res.status(500).json({ message: "Failed to fetch activities", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Simple categorization based on keywords (removed AI dependency)
  app.post("/api/categorize", async (req, res) => {
    try {
      const { description } = req.body;
      
      if (!description) {
        return res.status(400).json({ message: "Description is required" });
      }
      
      // Simple keyword-based categorization
      const text = description.toLowerCase();
      let category = "personal";
      let confidence = 0.6;
      
      if (text.includes("work") || text.includes("project") || text.includes("meeting") || text.includes("code") || text.includes("develop")) {
        category = "work";
        confidence = 0.8;
      } else if (text.includes("learn") || text.includes("study") || text.includes("course") || text.includes("read")) {
        category = "learning";
        confidence = 0.8;
      } else if (text.includes("gym") || text.includes("exercise") || text.includes("health") || text.includes("workout")) {
        category = "health";
        confidence = 0.8;
      } else if (text.includes("game") || text.includes("movie") || text.includes("tv") || text.includes("relax")) {
        category = "leisure";
        confidence = 0.7;
      }
      
      res.json({
        category,
        confidence,
        reasoning: `Categorized based on keywords in description`
      });
    } catch (error) {
      console.error("Failed to categorize activity:", error);
      res.status(500).json({ message: "Failed to categorize activity", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Analytics routes (removed AI dependency)
  app.get("/api/analytics/insights", async (req, res) => {
    try {
      const userId = "demo-user";
      const activities = await storage.getActivities(userId);
      
      // Generate simple insights without AI
      const totalHours = activities.reduce((sum, act) => sum + act.duration, 0);
      const workHours = activities.filter(a => a.category === 'work').reduce((sum, act) => sum + act.duration, 0);
      const insights = [
        `You've logged ${totalHours.toFixed(1)} hours of activities today`,
        `${workHours.toFixed(1)} hours were spent on work tasks`,
        `Most productive category: ${getMostProductiveCategory(activities)}`
      ];
      
      res.json({ insights });
    } catch (error) {
      console.error("Failed to generate insights:", error);
      res.status(500).json({ message: "Failed to generate insights", error: error instanceof Error ? error.message : String(error) });
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
      console.error("Failed to generate stats:", error);
      res.status(500).json({ message: "Failed to generate stats", error: error instanceof Error ? error.message : String(error) });
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
      console.error("Failed to fetch settings:", error);
      res.status(500).json({ message: "Failed to fetch settings", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const userId = "demo-user";
      const validatedData = insertSettingsSchema.parse(req.body);
      
      const settings = await storage.updateSettings(userId, validatedData);
      res.json(settings);
    } catch (error) {
      console.error("Failed to update settings:", error);
      res.status(400).json({ message: "Invalid settings data", error: error instanceof Error ? error.message : String(error) });
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
      console.error("Failed to export data:", error);
      res.status(500).json({ message: "Failed to export data", error: error instanceof Error ? error.message : String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
