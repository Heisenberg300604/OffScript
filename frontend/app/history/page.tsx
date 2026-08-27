import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Video } from "lucide-react";
import { AppNav, AppTabBar } from "@/components/app-nav";
import { requireUser } from "@/lib/dal";
import { getUserChallenges } from "@/lib/queries/challenges";

export const metadata: Metadata = { title: "History — OffScript" };

export const dynamic = "force-dynamic";

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

export default async function HistoryPage() {
  const user = await requireUser();
  // Scoped to the session user — there is no id in the URL to tamper with.
  const challenges = await getUserChallenges(user.id);

  return (
    <div className="min-h-screen bg-background">
      <AppNav current="/history" />

      <main className="mx-auto w-full max-w-[860px] px-5 pb-28 pt-28 md:px-8 md:pb-20">
        <header className="mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Archive
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">History</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {challenges.length === 0
              ? "Every completed challenge lands here."
              : `${challenges.length} completed challenge${challenges.length === 1 ? "" : "s"}.`}
          </p>
        </header>

        {challenges.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <p className="font-semibold">Nothing here yet.</p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Complete your first two-minute challenge and it will show up here,
              along with any YouTube link you attach.
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex h-11 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/80"
            >
              Get a topic
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {challenges.map((challenge) => (
              <li
                key={challenge.id}
                className="rounded-xl border border-border bg-card p-5"
              >
                <p className="font-semibold leading-snug">{challenge.topicPrompt}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>
                    {challenge.completedAt.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      timeZone: user.timezone,
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} /> {formatDuration(challenge.durationSeconds)}
                  </span>
                  {challenge.videoUrl ? (
                    <a
                      href={challenge.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-foreground underline underline-offset-4"
                    >
                      <Video size={13} /> Watch recording
                    </a>
                  ) : (
                    <span className="text-muted-foreground/70">No recording</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <AppTabBar current="/history" />
    </div>
  );
}
