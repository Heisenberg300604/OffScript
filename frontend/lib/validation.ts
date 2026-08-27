import { z } from "zod";

/** README V1: "The user should speak for a minimum of 2 minutes." */
export const MINIMUM_DURATION_SECONDS = 120;

/**
 * Not a product cap — the recorder is deliberately open-ended. This only rejects
 * obviously bogus payloads (24h+) so a typo can't poison the streak data.
 */
const MAX_PLAUSIBLE_DURATION_SECONDS = 60 * 60 * 6;

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

/**
 * Accepts the URL shapes YouTube actually hands out for an unlisted video:
 *   https://www.youtube.com/watch?v=ID
 *   https://youtu.be/ID
 *   https://www.youtube.com/shorts/ID
 *   https://www.youtube.com/live/ID
 * and rejects everything else, including look-alike hosts such as
 * `youtube.com.evil.test`.
 */
export function parseYouTubeUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (!YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) return null;

  const idPattern = /^[A-Za-z0-9_-]{11}$/;
  const segments = url.pathname.split("/").filter(Boolean);

  let videoId: string | undefined;

  if (url.hostname.toLowerCase().endsWith("youtu.be")) {
    videoId = segments[0];
  } else if (url.pathname === "/watch") {
    videoId = url.searchParams.get("v") ?? undefined;
  } else if (
    segments.length === 2 &&
    ["shorts", "live", "embed", "v"].includes(segments[0])
  ) {
    videoId = segments[1];
  }

  if (!videoId || !idPattern.test(videoId)) return null;

  // Normalise so history renders one consistent link shape.
  return `https://www.youtube.com/watch?v=${videoId}`;
}

const youTubeUrl = z
  .string()
  .trim()
  .transform((value, ctx) => {
    const normalised = parseYouTubeUrl(value);
    if (!normalised) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid YouTube video link.",
      });
      return z.NEVER;
    }
    return normalised;
  });

/** Empty string means "no video" — a challenge is completable without one. */
export const optionalYouTubeUrl = z
  .union([z.literal(""), youTubeUrl])
  .transform((value) => (value === "" ? null : value));

export const completeChallengeSchema = z.object({
  topicId: z.uuid({ message: "Invalid topic." }),
  durationSeconds: z
    .number()
    .int("Duration must be a whole number of seconds.")
    .min(
      MINIMUM_DURATION_SECONDS,
      `Speak for at least ${MINIMUM_DURATION_SECONDS} seconds to complete a challenge.`,
    )
    .max(MAX_PLAUSIBLE_DURATION_SECONDS, "Duration is implausibly long."),
  videoUrl: optionalYouTubeUrl.optional(),
});

export const attachVideoSchema = z.object({
  challengeId: z.uuid({ message: "Invalid challenge." }),
  videoUrl: optionalYouTubeUrl,
});

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(80, "Name is too long."),
  email: z.email({ message: "Enter a valid email address." }).max(255),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .max(128, "Password is too long."),
  timezone: z.string().max(64).optional(),
});

export const signInSchema = z.object({
  email: z.email({ message: "Enter a valid email address." }).max(255),
  password: z.string().min(1, "Enter your password."),
  timezone: z.string().max(64).optional(),
});

/**
 * Guards against writing junk into `AT TIME ZONE` style date maths. Falls back
 * to UTC rather than throwing, since a bad timezone should never block a login.
 */
export function normaliseTimezone(value: string | undefined | null): string {
  if (!value) return "UTC";
  try {
    // Throws RangeError for anything Node's ICU doesn't recognise.
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return value;
  } catch {
    return "UTC";
  }
}
