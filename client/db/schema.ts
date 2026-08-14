import { pgTable, text, integer, primaryKey, uniqueIndex, jsonb, boolean, customType } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const timestampInteger = customType<{ data: Date; driverData: number }>({
  dataType() {
    return "integer";
  },
  toDriver(value: Date): number {
    return Math.floor(value.getTime() / 1000);
  },
  fromDriver(value: number): Date {
    return new Date(value * 1000);
  },
});

// ============ AUTH ============
// better-auth generates and owns: user, session, account, verification.
// Don't hand-write these — run `npx @better-auth/cli generate` and let it
// manage that table set. Everything below references user.id as a plain
// text FK without a formal relation, since that table lives in better-auth's
// own schema file.

// ============ CONTENT (seeded, admin-managed) ============

export const courses = pgTable("courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),                 // "Spanish"
  fromLanguage: text("from_language").notNull(),   // "en"
  targetLanguage: text("target_language").notNull(), // "es"
  iconUrl: text("icon_url"),
});

export const units = pgTable("units", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  colorTheme: text("color_theme").default("green"),
});

export const skills = pgTable("skills", {
  id: text("id").primaryKey(),
  unitId: text("unit_id").notNull().references(() => units.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  title: text("title").notNull(),
  iconUrl: text("icon_url"),
  maxCrowns: integer("max_crowns").notNull().default(5),
  prerequisiteSkillIds: jsonb("prerequisite_skill_ids").$type<string[]>().default([]),
});

export const lessons = pgTable("lessons", {
  id: text("id").primaryKey(),
  skillId: text("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  type: text("type").notNull().default("new"),
  crownLevel: integer("crown_level").notNull().default(1),
});

export const exercises = pgTable("exercises", {
  id: text("id").primaryKey(),
  lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  type: text("type").notNull(),
  prompt: text("prompt").notNull(),
  options: jsonb("options").$type<string[]>(),               // MCQ / word bank
  correctAnswer: jsonb("correct_answer").$type<string | string[]>().notNull(),
  pairs: jsonb("pairs").$type<{ left: string; right: string }[]>(), // match_pairs
  audioUrl: text("audio_url"),
  imageUrl: text("image_url"),
});

// ============ USER PROFILE (extends better-auth's user) ============

export const userProfile = pgTable("user_profile", {
  userId: text("user_id").primaryKey(),
  username: text("username").notNull(),
  activeCourseId: text("active_course_id").references(() => courses.id),
  createdAt: timestampInteger("created_at").notNull().default(sql`extract(epoch from now())::integer`),
}, (t) => ({
  usernameIdx: uniqueIndex("username_idx").on(t.username),
}));

// ============ GAMIFICATION STATE (persisted per user) ============

export const userStats = pgTable("user_stats", {
  userId: text("user_id").primaryKey(),
  totalXp: integer("total_xp").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActivityDate: text("last_activity_date"),        // "YYYY-MM-DD"
  streakFreezeCount: integer("streak_freeze_count").notNull().default(0),
  hearts: integer("hearts").notNull().default(5),
  maxHearts: integer("max_hearts").notNull().default(5),
  lastHeartLostAt: timestampInteger("last_heart_lost_at"),
  gems: integer("gems").notNull().default(500),
  dailyGoalXp: integer("daily_goal_xp").notNull().default(20),
  updatedAt: timestampInteger("updated_at").notNull().default(sql`extract(epoch from now())::integer`),
});

export const userSkillProgress = pgTable("user_skill_progress", {
  userId: text("user_id").notNull(),
  skillId: text("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("locked"),
  crowns: integer("crowns").notNull().default(0),
  xpEarned: integer("xp_earned").notNull().default(0),
  lastPracticedAt: timestampInteger("last_practiced_at"),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.skillId] }),
}));

export const lessonAttempts = pgTable("lesson_attempts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  lessonId: text("lesson_id").notNull().references(() => lessons.id),
  startedAt: timestampInteger("started_at").notNull(),
  completedAt: timestampInteger("completed_at"),
  status: text("status").notNull().default("in_progress"),
  heartsLost: integer("hearts_lost").notNull().default(0),
  xpAwarded: integer("xp_awarded").notNull().default(0),
});

export const exerciseAttempts = pgTable("exercise_attempts", {
  id: text("id").primaryKey(),
  lessonAttemptId: text("lesson_attempt_id").notNull().references(() => lessonAttempts.id, { onDelete: "cascade" }),
  exerciseId: text("exercise_id").notNull().references(() => exercises.id),
  userAnswer: jsonb("user_answer"),
  isCorrect: boolean("is_correct").notNull(),
  timeTakenMs: integer("time_taken_ms"),
});

// Backbone for streaks, daily-goal ring, and weekly leaderboard aggregation
export const dailyActivity = pgTable("daily_activity", {
  userId: text("user_id").notNull(),
  date: text("date").notNull(),  // "YYYY-MM-DD"
  xpEarned: integer("xp_earned").notNull().default(0),
  lessonsCompleted: integer("lessons_completed").notNull().default(0),
  chestClaimed: boolean("chest_claimed").notNull().default(false),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.date] }),
}));

// ============ ACHIEVEMENTS ============

export const achievements = pgTable("achievements", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),          // "streak_7"
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconUrl: text("icon_url"),
  criteria: jsonb("criteria").notNull(), // { type: "streak", value: 7 }
});

export const userAchievements = pgTable("user_achievements", {
  userId: text("user_id").notNull(),
  achievementId: text("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: timestampInteger("unlocked_at").notNull().default(sql`extract(epoch from now())::integer`),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.achievementId] }),
}));

// ============ SOCIAL / MULTIPLAYER ============

export const friendships = pgTable("friendships", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  friendId: text("friend_id").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestampInteger("created_at").notNull().default(sql`extract(epoch from now())::integer`),
});

export const multiplayerMatches = pgTable("multiplayer_matches", {
  id: text("id").primaryKey(),
  hostUserId: text("host_user_id").notNull(),
  skillId: text("skill_id").references(() => skills.id),
  status: text("status").notNull().default("waiting"),
  createdAt: timestampInteger("created_at").notNull().default(sql`extract(epoch from now())::integer`),
  startedAt: timestampInteger("started_at"),
  endedAt: timestampInteger("ended_at"),
});

export const multiplayerParticipants = pgTable("multiplayer_participants", {
  id: text("id").primaryKey(),
  matchId: text("match_id").notNull().references(() => multiplayerMatches.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  score: integer("score").notNull().default(0),
  correctCount: integer("correct_count").notNull().default(0),
  finishedAt: timestampInteger("finished_at"),
});
