import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/**
 * Patient Health Profile Table
 */
export const patientProfiles = mysqlTable("patient_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull().unique(),
  fullName: varchar("fullName", { length: 128 }).notNull(),
  age: varchar("age", { length: 8 }).notNull(),
  gender: varchar("gender", { length: 32 }).notNull(),
  bloodGroup: varchar("bloodGroup", { length: 16 }),
  conditions: json("conditions").$type<string[]>(),
  medications: text("medications"),
  allergies: text("allergies"),
  isComplete: int("isComplete").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Chat Sessions Table
 */
export const chatSessions = mysqlTable("chat_sessions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  title: varchar("title", { length: 256 }).default("Health Consultation").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Chat Messages Table
 */
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  role: mysqlEnum("role", ["system", "user", "assistant"]).notNull(),
  content: text("content").notNull(),
  image: text("image"),
  imageName: varchar("imageName", { length: 256 }),
  quickReplies: json("quickReplies").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Lab Reports Log Table
 */
export const labReports = mysqlTable("lab_reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  fileName: varchar("fileName", { length: 256 }).notNull(),
  reportType: varchar("reportType", { length: 128 }).default("CBC Blood Test").notNull(),
  findingsSummary: text("findingsSummary"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type PatientProfileSelect = typeof patientProfiles.$inferSelect;
export type InsertPatientProfile = typeof patientProfiles.$inferInsert;
export type ChatSessionSelect = typeof chatSessions.$inferSelect;
export type ChatMessageSelect = typeof chatMessages.$inferSelect;
export type LabReportSelect = typeof labReports.$inferSelect;