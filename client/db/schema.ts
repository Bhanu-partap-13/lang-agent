import { sqliteTable, text, integer, primaryKey, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ============ AUTH ============
// better-auth generates and owns: user, session, account, verification.
// Don't hand-write these — run `npx @better-auth/cli generate` and let it
// manage that table set. Everything below references user.id as a plain
// text FK without a formal relation, since that table lives in better-auth's
// own schema file.

// ============ CONTENT (seeded, admin-managed) ============

export const courses = sqliteTable("courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),                 // "Spanish"
  fromLanguage: text("from_language").notNull(),   // "en"
  targetLanguage: text("target_language").notNull(), // "es"
  iconUrl: text("icon_url"),
});

export const units = sqliteTable("units", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  colorTheme: text("color_theme").default("green"),
});

export const skills = sqliteTable("skills", {
  id: text("id").primaryKey(),
  unitId: text("unit_id").notNull().references(() => units.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  title: text("title").notNull(),
  iconUrl: text("icon_url"),
  maxCrowns: integer("max_crowns").notNull().default(5),
  prerequisiteSkillIds: text("prerequisite_skill_ids", { mode: "json" }).$type<string[]>().default([]),
});

export const lessons = sqliteTable("lessons", {
  id: text("id").primaryKey(),
  skillId: text("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  type: text("type", { enum: ["new", "practice", "legendary"] }).notNull().default("new"),
  crownLevel: integer("crown_level").notNull().default(1),
});

export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey(),
  lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  type: text("type", {
    enum: ["multiple_choice", "translate", "match_pairs", "fill_blank", "type_answer"],
  }).notNull(),
  prompt: text("prompt").notNull(),
  options: text("options", { mode: "json" }).$type<string[]>(),               // MCQ / word bank
  correctAnswer: text("correct_answer", { mode: "json" }).$type<string | string[]>().notNull(),
  pairs: text("pairs", { mode: "json" }).$type<{ left: string; right: string }[]>(), // match_pairs
  audioUrl: text("audio_url"),
  imageUrl: text("image_url"),
});

// ============ USER PROFILE (extends better-auth's user) ============

export const userProfile = sqliteTable("user_profile", {
  userId: text("user_id").primaryKey(),
  username: text("username").notNull(),
  activeCourseId: text("active_course_id").references(() => courses.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
}, (t) => ({
  usernameIdx: uniqueIndex("username_idx").on(t.username),
}));

// ============ GAMIFICATION STATE (persisted per user) ============

export const userStats = sqliteTable("user_stats", {
  userId: text("user_id").primaryKey(),
  totalXp: integer("total_xp").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActivityDate: text("last_activity_date"),        // "YYYY-MM-DD"
  streakFreezeCount: integer("streak_freeze_count").notNull().default(0),
  hearts: integer("hearts").notNull().default(5),
  maxHearts: integer("max_hearts").notNull().default(5),
  lastHeartLostAt: integer("last_heart_lost_at", { mode: "timestamp" }),
  gems: integer("gems").notNull().default(500),
  dailyGoalXp: integer("daily_goal_xp").notNull().default(20),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

export const userSkillProgress = sqliteTable("user_skill_progress", {
  userId: text("user_id").notNull(),
  skillId: text("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["locked", "available", "in_progress", "completed"] }).notNull().default("locked"),
  crowns: integer("crowns").notNull().default(0),
  xpEarned: integer("xp_earned").notNull().default(0),
  lastPracticedAt: integer("last_practiced_at", { mode: "timestamp" }),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.skillId] }),
}));

export const lessonAttempts = sqliteTable("lesson_attempts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  lessonId: text("lesson_id").notNull().references(() => lessons.id),
  startedAt: integer("started_at", { mode: "timestamp" }).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  status: text("status", { enum: ["in_progress", "passed", "failed"] }).notNull().default("in_progress"),
  heartsLost: integer("hearts_lost").notNull().default(0),
  xpAwarded: integer("xp_awarded").notNull().default(0),
});

export const exerciseAttempts = sqliteTable("exercise_attempts", {
  id: text("id").primaryKey(),
  lessonAttemptId: text("lesson_attempt_id").notNull().references(() => lessonAttempts.id, { onDelete: "cascade" }),
  exerciseId: text("exercise_id").notNull().references(() => exercises.id),
  userAnswer: text("user_answer", { mode: "json" }),
  isCorrect: integer("is_correct", { mode: "boolean" }).notNull(),
  timeTakenMs: integer("time_taken_ms"),
});

// Backbone for streaks, daily-goal ring, and weekly leaderboard aggregation
export const dailyActivity = sqliteTable("daily_activity", {
  userId: text("user_id").notNull(),
  date: text("date").notNull(),  // "YYYY-MM-DD"
  xpEarned: integer("xp_earned").notNull().default(0),
  lessonsCompleted: integer("lessons_completed").notNull().default(0),
  chestClaimed: integer("chest_claimed", { mode: "boolean" }).notNull().default(false),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.date] }),
}));

// ============ ACHIEVEMENTS ============

export const achievements = sqliteTable("achievements", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),          // "streak_7"
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconUrl: text("icon_url"),
  criteria: text("criteria", { mode: "json" }).notNull(), // { type: "streak", value: 7 }
});

export const userAchievements = sqliteTable("user_achievements", {
  userId: text("user_id").notNull(),
  achievementId: text("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: integer("unlocked_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.achievementId] }),
}));

// ============ SOCIAL / MULTIPLAYER ============

export const friendships = sqliteTable("friendships", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  friendId: text("friend_id").notNull(),
  status: text("status", { enum: ["pending", "accepted", "blocked"] }).notNull().default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

export const multiplayerMatches = sqliteTable("multiplayer_matches", {
  id: text("id").primaryKey(),
  hostUserId: text("host_user_id").notNull(),
  skillId: text("skill_id").references(() => skills.id),
  status: text("status", { enum: ["waiting", "active", "finished"] }).notNull().default("waiting"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  startedAt: integer("started_at", { mode: "timestamp" }),
  endedAt: integer("ended_at", { mode: "timestamp" }),
});

export const multiplayerParticipants = sqliteTable("multiplayer_participants", {
  id: text("id").primaryKey(),
  matchId: text("match_id").notNull().references(() => multiplayerMatches.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  score: integer("score").notNull().default(0),
  correctCount: integer("correct_count").notNull().default(0),
  finishedAt: integer("finished_at", { mode: "timestamp" }),
});
