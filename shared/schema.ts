import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // work, personal, health, learning, leisure
  duration: real("duration").notNull(), // in hours
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  aiSuggested: text("ai_suggested"), // the AI suggested category
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  hourlyReminders: text("hourly_reminders").default("true"),
  weekendNotifications: text("weekend_notifications").default("false"),
  soundNotifications: text("sound_notifications").default("true"),
  workStart: text("work_start").default("09:00"),
  workEnd: text("work_end").default("17:00"),
  aiCategorization: text("ai_categorization").default("true"),
  aiInsights: text("ai_insights").default("true"),
  aiSuggestions: text("ai_suggestions").default("true"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  description: true,
  category: true,
  duration: true,
  startTime: true,
  endTime: true,
  aiSuggested: true,
}).extend({
  userId: z.string().optional(),
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  userId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

export const CATEGORIES = ["work", "personal", "health", "learning", "leisure"] as const;
export type Category = typeof CATEGORIES[number];
