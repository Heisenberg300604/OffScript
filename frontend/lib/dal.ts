import "server-only";

import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userProfiles } from "@/db/schema";

export type CurrentUser = {
  /** Clerk user id. The authenticated identity, never taken from the client. */
  id: string;
  /** IANA timezone; drives streak + heatmap day boundaries. */
  timezone: string;
};

/**
 * The single source of truth for "who is making this request".
 *
 * Clerk's middleware authenticates the request; `auth()` reads the verified
 * session. We then ensure a matching row exists in our own `user` table so
 * `challenges.user_id` always has a valid foreign key, and read back the
 * stored timezone.
 *
 * Memoised per render pass with React `cache`, so a page that needs the user in
 * several places still costs one lookup.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const { userId } = await auth();
  if (!userId) return null;

  // Fast path: existing user — one indexed SELECT.
  const [existing] = await db
    .select({ timezone: userProfiles.timezone })
    .from(userProfiles)
    .where(eq(userProfiles.id, userId));

  if (existing) {
    return { id: userId, timezone: existing.timezone ?? "UTC" };
  }

  // First authenticated request for this Clerk user: create the profile row.
  // onConflictDoNothing guards against a race between concurrent requests.
  await db.insert(userProfiles).values({ id: userId }).onConflictDoNothing();
  return { id: userId, timezone: "UTC" };
});

/**
 * Use in anything that must not run for a signed-out visitor. Redirects to the
 * Clerk sign-in page rather than returning null, so callers can't forget the
 * check. Clerk's middleware already guards these routes; this is defence in
 * depth at the data layer.
 */
export async function requireUser(): Promise<CurrentUser> {
  const current = await getCurrentUser();
  if (!current) redirect("/sign-in");
  return current;
}
