"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw } from "lucide-react";

/**
 * Route-level error boundary. Wraps every page below the root layout.
 *
 * Next 16 passes `retry()`, which re-fetches and re-renders the boundary's
 * children — preferred over `reset()`, which only clears the error state.
 *
 * In production the `error` object is deliberately scrubbed of details; only
 * `digest` crosses to the client, and it matches a server-side log entry.
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // Surfaces in Vercel's runtime logs alongside the matching digest.
    console.error("Route error:", error);
  }, [error]);

  return (
    <main className="status-page">
      <Link href="/" className="status-mark">
        OFFSCRIPT
      </Link>

      <p className="status-kicker">Something broke</p>
      <h1 className="status-title">We lost our train of thought.</h1>
      <p className="status-copy">
        An unexpected error stopped this page from loading. Your streak and your
        saved challenges are untouched — trying again usually clears it.
      </p>

      <div className="status-actions">
        <button type="button" onClick={() => retry()} className="status-cta">
          <RotateCw size={16} /> Try again
        </button>
        <Link href="/dashboard" className="status-ghost">
          Back to dashboard
        </Link>
      </div>

      {error.digest && <p className="status-digest">Reference: {error.digest}</p>}
    </main>
  );
}
