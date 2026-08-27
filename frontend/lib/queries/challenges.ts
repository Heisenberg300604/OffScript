import "server-only";

import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { challenges, topics } from "@/db/schema";

export type ChallengeRecord = {
  id: string;
  topicPrompt: string;
  durationSeconds: number;
  videoUrl: string | null;
  completedAt: Date;
  localDate: string;
};

export type ActivityDay = {
  /** YYYY-MM-DD in the user's timezone. */
  date: string;
  count: number;
};

/**
 * Timezone strategy (V1)
 * ----------------------
 * `completed_at` is an absolute instant written by the server. `local_date` is
 * that instant rendered in the user's IANA timezone, also resolved server-side
 * at write time.
 *
 * Bucketing by the stored `local_date` (rather than converting on read) means:
 *   - a session at 00:30 local counts for the day the user experienced,
 *   - a past day never silently shifts if the user later travels,
 *   - streak/heatmap queries stay a plain indexed scan.
 */
export function localDateFor(instant: Date, timezone: string): string {
  // en-CA gives ISO-ordered YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

function addDays(isoDate: string, delta: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + delta));
  return next.toISOString().slice(0, 10);
}

/**
 * Consecutive calendar days (in the user's timezone) on which they completed at
 * least one challenge.
 *
 * Today not yet done does not break the streak — it only ends once yesterday is
 * also missed. README: "Missing one day shouldn't mean the entire purpose of
 * the application is lost."
 */
export async function getUserStreak(
  userId: string,
  timezone: string,
): Promise<number> {
  const rows = await db
    .selectDistinct({ day: challenges.localDate })
    .from(challenges)
    .where(eq(challenges.userId, userId))
    .orderBy(desc(challenges.localDate));

  if (rows.length === 0) return 0;

  const days = new Set(rows.map((row) => row.day));
  const today = localDateFor(new Date(), timezone);
  const yesterday = addDays(today, -1);

  let cursor: string;
  if (days.has(today)) cursor = today;
  else if (days.has(yesterday)) cursor = yesterday;
  else return 0;

  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** Per-day completion counts for a GitHub-style heatmap. */
export async function getUserActivity(
  userId: string,
  startDate: string,
  endDate: string,
): Promise<ActivityDay[]> {
  const rows = await db
    .select({
      date: challenges.localDate,
      count: sql<number>`count(*)::int`,
    })
    .from(challenges)
    .where(
      and(
        eq(challenges.userId, userId),
        gte(challenges.localDate, startDate),
        lte(challenges.localDate, endDate),
      ),
    )
    .groupBy(challenges.localDate)
    .orderBy(challenges.localDate);

  return rows.map((row) => ({ date: row.date, count: Number(row.count) }));
}

export async function getUserChallenges(
  userId: string,
  limit?: number,
): Promise<ChallengeRecord[]> {
  const query = db
    .select({
      id: challenges.id,
      topicPrompt: challenges.topicPrompt,
      durationSeconds: challenges.durationSeconds,
      videoUrl: challenges.videoUrl,
      completedAt: challenges.completedAt,
      localDate: challenges.localDate,
    })
    .from(challenges)
    .where(eq(challenges.userId, userId))
    .orderBy(desc(challenges.completedAt));

  return limit ? query.limit(limit) : query;
}

export async function getUserTotals(userId: string) {
  const [row] = await db
    .select({
      sessions: sql<number>`count(*)::int`,
      totalSeconds: sql<number>`coalesce(sum(${challenges.durationSeconds}), 0)::int`,
      activeDays: sql<number>`count(distinct ${challenges.localDate})::int`,
    })
    .from(challenges)
    .where(eq(challenges.userId, userId));

  return {
    sessions: Number(row?.sessions ?? 0),
    totalSeconds: Number(row?.totalSeconds ?? 0),
    activeDays: Number(row?.activeDays ?? 0),
  };
}

export async function insertChallenge(input: {
  userId: string;
  topicId: string;
  topicPrompt: string;
  durationSeconds: number;
  videoUrl: string | null;
  completedAt: Date;
  localDate: string;
}) {
  const [row] = await db
    .insert(challenges)
    .values(input)
    .returning({ id: challenges.id });
  return row;
}

/**
 * Scoped by userId as well as challengeId, so a guessed id belonging to someone
 * else updates zero rows instead of theirs.
 */
export async function updateChallengeVideoUrl(
  userId: string,
  challengeId: string,
  videoUrl: string | null,
) {
  const rows = await db
    .update(challenges)
    .set({ videoUrl })
    .where(and(eq(challenges.id, challengeId), eq(challenges.userId, userId)))
    .returning({ id: challenges.id });
  return rows.length > 0;
}

export async function getTopicById(topicId: string) {
  const [row] = await db
    .select({ id: topics.id, prompt: topics.prompt })
    .from(topics)
    .where(eq(topics.id, topicId))
    .limit(1);
  return row ?? null;
}

/**
 * A batch of random prompts used purely as visual filler for the generator's
 * spinning reel. These are never persisted — the real topic is chosen
 * separately by getRandomTopic().
 */
export async function getReelPrompts(count: number): Promise<string[]> {
  const rows = await db
    .select({ prompt: topics.prompt })
    .from(topics)
    .orderBy(sql`random()`)
    .limit(count);
  return rows.map((row) => row.prompt);
}

/** Random prompt, avoiding an immediate repeat of the one just shown. */
export async function getRandomTopic(excludeId?: string) {
  const rows = await db
    .select({ id: topics.id, prompt: topics.prompt })
    .from(topics)
    .where(excludeId ? sql`${topics.id} <> ${excludeId}` : undefined)
    .orderBy(sql`random()`)
    .limit(1);

  if (rows[0]) return rows[0];

  // Pool of one: repeating is better than returning nothing.
  const [fallback] = await db
    .select({ id: topics.id, prompt: topics.prompt })
    .from(topics)
    .orderBy(sql`random()`)
    .limit(1);
  return fallback ?? null;
}
