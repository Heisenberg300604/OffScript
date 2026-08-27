"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/dal";
import {
  getRandomTopic,
  getReelPrompts,
  getTopicById,
  insertChallenge,
  localDateFor,
  updateChallengeVideoUrl,
} from "@/lib/queries/challenges";
import { attachVideoSchema, completeChallengeSchema } from "@/lib/validation";

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/**
 * Server-picked prompt. The client never supplies topic text.
 *
 * `reel` is a handful of extra prompts the generator flicks through while it
 * "spins". They are decoration only — the challenge is always saved against
 * `topic`, which the server re-reads by id at completion time.
 */
export async function generateTopicAction(
  excludeId?: string,
): Promise<ActionResult<{ topic: { id: string; prompt: string }; reel: string[] }>> {
  await requireUser();

  const [topic, reel] = await Promise.all([
    getRandomTopic(excludeId),
    getReelPrompts(14),
  ]);

  if (!topic) {
    return { ok: false, error: "No topics available yet. Run `pnpm db:seed`." };
  }
  return { ok: true, data: { topic, reel } };
}

/**
 * Writes the completed challenge.
 *
 * - user comes from the session, never from the payload
 * - the prompt is re-read from the DB by id and snapshotted, so the client
 *   can't invent the topic it claims to have spoken about
 * - completedAt is the server clock
 */
export async function completeChallengeAction(input: {
  topicId: string;
  durationSeconds: number;
  videoUrl?: string;
}): Promise<ActionResult<{ challengeId: string }>> {
  const user = await requireUser();

  const parsed = completeChallengeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid data." };
  }

  const topic = await getTopicById(parsed.data.topicId);
  if (!topic) return { ok: false, error: "That topic no longer exists." };

  const completedAt = new Date();
  const row = await insertChallenge({
    userId: user.id,
    topicId: topic.id,
    topicPrompt: topic.prompt,
    durationSeconds: parsed.data.durationSeconds,
    videoUrl: parsed.data.videoUrl ?? null,
    completedAt,
    localDate: localDateFor(completedAt, user.timezone),
  });

  revalidatePath("/dashboard");
  revalidatePath("/history");
  revalidatePath("/progress");

  return { ok: true, data: { challengeId: row.id } };
}

/** Optional YouTube archive link, attachable after the fact. */
export async function attachVideoUrlAction(input: {
  challengeId: string;
  videoUrl: string;
}): Promise<ActionResult> {
  const user = await requireUser();

  const parsed = attachVideoSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid link." };
  }

  // Scoped to the session user — a guessed challenge id matches nothing.
  const updated = await updateChallengeVideoUrl(
    user.id,
    parsed.data.challengeId,
    parsed.data.videoUrl,
  );
  if (!updated) return { ok: false, error: "Challenge not found." };

  revalidatePath("/dashboard");
  revalidatePath("/history");

  return { ok: true, data: undefined };
}
