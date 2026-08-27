import type { Metadata } from "next";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { Clock, Flame, Video } from "lucide-react";
import { AppNav, AppTabBar } from "@/components/app-nav";
import { TimezoneSync } from "@/components/timezone-sync";
import { requireUser } from "@/lib/dal";
import {
  getUserChallenges,
  getUserStreak,
  getUserTotals,
  localDateFor,
} from "@/lib/queries/challenges";
import { TopicGenerator } from "./topic-generator";

export const metadata: Metadata = { title: "Today — OffScript" };

// Session-derived, per-user data: must never be statically cached.
export const dynamic = "force-dynamic";

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export default async function DashboardPage() {
  const user = await requireUser();

  const [clerkUser, streak, totals, recent] = await Promise.all([
    currentUser(),
    getUserStreak(user.id, user.timezone),
    getUserTotals(user.id),
    getUserChallenges(user.id, 5),
  ]);

  const firstName = clerkUser?.firstName?.trim() || "there";
  const today = localDateFor(new Date(), user.timezone);
  const doneToday = recent.some((challenge) => challenge.localDate === today);

  return (
    <div className="min-h-screen bg-background">
      <TimezoneSync current={user.timezone} />
      <AppNav current="/dashboard" />

      <main className="mx-auto w-full max-w-[860px] px-5 pb-28 pt-28 md:px-8 md:pb-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              {doneToday ? "Today — complete" : "Today's challenge"}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {doneToday
                ? `Nice work, ${firstName}.`
                : `Ready when you are, ${firstName}.`}
            </h1>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
            <Flame
              size={18}
              className={streak > 0 ? "text-accent-foreground" : "text-muted-foreground"}
            />
            <span className="text-lg font-bold tabular-nums">{streak}</span>
            <span className="text-sm text-muted-foreground">
              day{streak === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <TopicGenerator alreadyDoneToday={doneToday} />

        <section className="mt-14">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-lg font-bold">Recent challenges</h2>
            {totals.sessions > 0 && (
              <Link
                href="/history"
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                View all {totals.sessions}
              </Link>
            )}
          </div>

          {recent.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
              <p className="font-semibold">No sessions yet.</p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Generate a topic above and speak for two minutes. Your streak and
                activity grid start with your first completed challenge.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {recent.map((challenge) => (
                <li
                  key={challenge.id}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <p className="font-semibold leading-snug">{challenge.topicPrompt}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> {formatDuration(challenge.durationSeconds)}
                    </span>
                    <span>
                      {challenge.completedAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        timeZone: user.timezone,
                      })}
                    </span>
                    {challenge.videoUrl && (
                      <a
                        href={challenge.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-foreground underline underline-offset-4"
                      >
                        <Video size={13} /> Recording
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <AppTabBar current="/dashboard" />
    </div>
  );
}
