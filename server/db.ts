import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  patientProfiles,
  InsertPatientProfile,
  chatMessages,
  chatSessions,
  labReports
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Memory stores for local development without active MySQL DB instance
const memoryPatientProfiles = new Map<string, any>();
const memoryChatMessages = new Map<string, any[]>();
const memoryLabReports = new Map<string, any[]>();

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not connected (using session storage)");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Upsert Patient Health Profile into DB or memory fallback
 */
export async function upsertPatientProfile(profile: InsertPatientProfile) {
  const db = await getDb();
  if (!db) {
    memoryPatientProfiles.set(profile.userId, profile);
    return profile;
  }

  try {
    await db.insert(patientProfiles).values(profile).onDuplicateKeyUpdate({
      set: {
        fullName: profile.fullName,
        age: profile.age,
        gender: profile.gender,
        bloodGroup: profile.bloodGroup,
        conditions: profile.conditions,
        medications: profile.medications,
        allergies: profile.allergies,
        isComplete: 1,
        updatedAt: new Date(),
      },
    });
    return profile;
  } catch (err) {
    console.error("[Database] Failed to upsert patient profile:", err);
    memoryPatientProfiles.set(profile.userId, profile);
    return profile;
  }
}

/**
 * Retrieve Patient Health Profile
 */
export async function getPatientProfileByUserId(userId: string) {
  const db = await getDb();
  if (!db) {
    return memoryPatientProfiles.get(userId) || null;
  }

  try {
    const result = await db
      .select()
      .from(patientProfiles)
      .where(eq(patientProfiles.userId, userId))
      .limit(1);
    return result.length > 0 ? result[0] : memoryPatientProfiles.get(userId) || null;
  } catch (err) {
    console.error("[Database] Error getting patient profile:", err);
    return memoryPatientProfiles.get(userId) || null;
  }
}

/**
 * Save Chat Message in Session
 */
export async function saveChatMessageRecord(msg: {
  sessionId: string;
  role: "system" | "user" | "assistant";
  content: string;
  image?: string;
  imageName?: string;
}) {
  const db = await getDb();
  if (!db) {
    const existing = memoryChatMessages.get(msg.sessionId) || [];
    existing.push({ ...msg, createdAt: new Date() });
    memoryChatMessages.set(msg.sessionId, existing);
    return msg;
  }

  try {
    await db.insert(chatMessages).values(msg);
    return msg;
  } catch (err) {
    console.error("[Database] Failed to save chat message:", err);
    const existing = memoryChatMessages.get(msg.sessionId) || [];
    existing.push({ ...msg, createdAt: new Date() });
    memoryChatMessages.set(msg.sessionId, existing);
    return msg;
  }
}

/**
 * Retrieve Chat History for a Session
 */
export async function getChatMessagesBySessionId(sessionId: string) {
  const db = await getDb();
  if (!db) {
    return memoryChatMessages.get(sessionId) || [];
  }

  try {
    const msgs = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId));
    return msgs;
  } catch (err) {
    return memoryChatMessages.get(sessionId) || [];
  }
}

/**
 * Save Uploaded Lab Report Record
 */
export async function saveLabReportRecord(report: {
  userId: string;
  fileName: string;
  reportType: string;
  findingsSummary: string;
}) {
  const db = await getDb();
  if (!db) {
    const existing = memoryLabReports.get(report.userId) || [];
    existing.push({ ...report, createdAt: new Date() });
    memoryLabReports.set(report.userId, existing);
    return report;
  }

  try {
    await db.insert(labReports).values(report);
    return report;
  } catch (err) {
    const existing = memoryLabReports.get(report.userId) || [];
    existing.push({ ...report, createdAt: new Date() });
    memoryLabReports.set(report.userId, existing);
    return report;
  }
}
