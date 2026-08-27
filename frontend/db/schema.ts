import {
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/* -------------------------------------------------------------------------- */
/*  Identity                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * A local shadow of a Clerk user.
 *
 * Clerk is the system of record for authentication and profile data (name,
 * email, avatar) — none of that is duplicated here. This table exists for two
 * reasons only:
 *
 *   1. `challenges.user_id` needs a real foreign key, so a challenge can never
 *      reference a user that does not exist, and deleting a profile cascades to
 *      that person's history.
 *   2. It stores the one piece of per-user state Clerk does not model for us:
 *      the IANA timezone that streak and heatmap day-bucketing depend on.
 *
 * `id` is the Clerk user id (e.g. "user_2ab..."). Rows are created lazily on the
 * first authenticated request — see lib/dal.ts.
 */
export const userProfiles = pgTable("user_profiles", {
  /** Clerk user id. The authenticated identity, never taken from the client. */
  id: text("id").primaryKey(),
  /**
   * IANA timezone (e.g. "Asia/Kolkata"). Not a security boundary, so it is safe
   * to accept from the browser, but it is validated against ICU before being
   * stored. Readers default a null value to UTC.
   */
  timezone: text("timezone").default("UTC"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/* -------------------------------------------------------------------------- */
/*  Product tables                                                             */
/* -------------------------------------------------------------------------- */

/**
 * The catalog of speaking prompts. Kept independent of `challenges` so the pool
 * can grow or be edited without touching anyone's history.
 *
 * README V1 deliberately has no categories or difficulty levels, so a topic is
 * just a prompt.
 */
export const topics = pgTable(
  "topics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    prompt: text("prompt").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("topics_prompt_unique").on(table.prompt)],
);

/**
 * A completed speaking session.
 *
 * `topicId` is a soft reference (ON DELETE SET NULL) while `topicPrompt` is a
 * permanent snapshot of the wording the user actually spoke to. Editing or
 * deleting a topic later can never rewrite or orphan somebody's history.
 *
 * `localDate` is the challenge's calendar day in the user's timezone, resolved
 * on the server at write time. Storing it makes streak and heatmap queries
 * exact and index-friendly, and keeps a past day correct even if the user later
 * moves timezone.
 */
export const challenges = pgTable(
  "challenges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    topicId: uuid("topic_id").references(() => topics.id, { onDelete: "set null" }),
    topicPrompt: text("topic_prompt").notNull(),
    durationSeconds: integer("duration_seconds").notNull(),
    videoUrl: text("video_url"),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull(),
    localDate: date("local_date").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // Drives history (most recent first) and all per-user activity queries.
    index("challenges_user_completed_at_idx").on(table.userId, table.completedAt.desc()),
    // Drives streak + heatmap day bucketing.
    index("challenges_user_local_date_idx").on(table.userId, table.localDate),
  ],
);

export type Challenge = typeof challenges.$inferSelect;
export type Topic = typeof topics.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
