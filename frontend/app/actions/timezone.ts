"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userProfiles } from "@/db/schema";
import { getCurrentUser } from "@/lib/dal";
import { normaliseTimezone } from "@/lib/validation";

/**
 * Keeps the stored IANA timezone in step with the browser's.
 *
 * The sign-up form sends a timezone, but that depends on a client effect having
 * run before submit, so it can silently fall back to UTC. Streak and heatmap
 * day boundaries depend on this value, so the dashboard re-reports it on load
 * and corrects the row when it differs. Also handles users who travel.
 *
 * Timezone is not a security boundary, but it is still validated against ICU
 * and only ever written to the session user's own row.
 */
export async function syncTimezoneAction(timezone: string): Promise<void> {
  const current = await getCurrentUser();
  if (!current) return;

  const next = normaliseTimezone(timezone);
  // Don't let a bogus value overwrite a good one with "UTC".
  if (next === current.timezone || next === "UTC") return;

  await db.update(userProfiles).set({ timezone: next }).where(eq(userProfiles.id, current.id));
}
