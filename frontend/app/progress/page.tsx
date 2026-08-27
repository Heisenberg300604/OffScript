import type { Metadata } from "next";
import Link from "next/link";
import { Flame } from "lucide-react";
import { AppNav, AppTabBar } from "@/components/app-nav";
import { Heatmap } from "@/components/heatmap";
import { requireUser } from "@/lib/dal";
import {
  getUserActivity,
  getUserStreak,
  getUserTotals,
  localDateFor,
} from "@/lib/queries/challenges";

export const metadata: Metadata = { title: "Progress — OffScript" };

export const dynamic = "force-dynamic";

const WEEKS = 26;

function shiftDays(isoDate: string, delta: number) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + delta));
  return date.toISOString().slice(0, 10);
}

export default async function ProgressPage() {
  const user = await requireUser();

  const today = localDateFor(new Date(), user.timezone);
  const start = shiftDays(today, -(WEEKS * 7));

  const [streak, totals, activity] = await Promise.all([
    getUserStreak(user.id, user.timezone),
    getUserTotals(user.id),
    getUserActivity(user.id, start, today),
  ]);

  const minutes = Math.round(totals.totalSeconds / 60);

  return (
    <div className="min-h-screen bg-background">
      <AppNav current="/progress" />

      <main className="mx-auto w-full max-w-[860px] px-5 pb-28 pt-28 md:px-8 md:pb-20">
        <header className="mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Consistency
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Progress</h1>
        </header>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat
            label="Current streak"
            value={String(streak)}
            unit={streak === 1 ? "day" : "days"}
            icon={
              <Flame
                size={16}
                className={streak > 0 ? "text-accent-foreground" : "text-muted-foreground"}
              />
            }
          />
          <Stat label="Sessions" value={String(totals.sessions)} />
          <Stat label="Minutes spoken" value={String(minutes)} />
          <Stat label="Active days" value={String(totals.activeDays)} />
        </div>

        <section className="mt-10 rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 className="font-bold">Speaking activity</h2>
            <span className="text-xs text-muted-foreground">Last {WEEKS} weeks</span>
          </div>

          {totals.sessions === 0 ? (
            <div className="py-10 text-center">
              <p className="font-semibold">No activity yet.</p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Your grid fills in one square at a time. The contribution here is
                simple: you spoke today.
              </p>
              <Link
                href="/dashboard"
                className="mt-6 inline-flex h-11 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/80"
              >
                Get a topic
              </Link>
            </div>
          ) : (
            <Heatmap activity={activity} endDate={today} weeks={WEEKS} />
          )}
        </section>

        <p className="mt-5 text-xs leading-5 text-muted-foreground">
          Days roll over at midnight in your timezone ({user.timezone}).
        </p>
      </main>

      <AppTabBar current="/progress" />
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  icon,
}: {
  label: string;
  value: string;
  unit?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums">
        {value}
        {unit && (
          <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>
        )}
      </p>
    </div>
  );
}
