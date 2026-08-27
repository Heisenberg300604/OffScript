"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { syncTimezoneAction } from "@/app/actions/timezone";

/**
 * Renders nothing. Reports the browser's timezone once per mount so streak and
 * heatmap days roll over at the user's real midnight even if the sign-up form
 * submitted before its timezone effect ran.
 */
export function TimezoneSync({ current }: { current: string }) {
  const router = useRouter();

  useEffect(() => {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!detected || detected === current) return;

    let cancelled = false;
    syncTimezoneAction(detected).then(() => {
      // Streak/heatmap were rendered against the old zone — pull fresh data.
      if (!cancelled) router.refresh();
    });

    return () => {
      cancelled = true;
    };
  }, [current, router]);

  return null;
}
