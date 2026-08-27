import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found — OffScript",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="status-page">
      <Link href="/" className="status-mark">
        OFFSCRIPT
      </Link>

      <p className="status-kicker">404 — Off script</p>
      <h1 className="status-title">This page went quiet.</h1>
      <p className="status-copy">
        The link you followed doesn&apos;t lead anywhere. Nothing to research
        here — head back and pick up a topic instead.
      </p>

      <div className="status-actions">
        <Link href="/dashboard" className="status-cta">
          Get a topic <ArrowRight size={16} />
        </Link>
        <Link href="/" className="status-ghost">
          Back to home
        </Link>
      </div>
    </main>
  );
}
