"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

/**
 * Last-resort boundary for errors thrown by the root layout itself — most
 * plausibly a missing or invalid Clerk publishable key on a fresh deploy,
 * since <ClerkProvider> lives there.
 *
 * This file *replaces* the root layout when active, so it must render its own
 * <html>/<body>, and it receives no global stylesheet or next/font. Everything
 * is therefore inlined, using the same palette as globals.css with a system
 * serif standing in for Instrument Serif.
 */
const palette = {
  background: "#f4f1e9",
  foreground: "#202524",
  muted: "#727773",
  primary: "#18201f",
  primaryText: "#f5f1e7",
  accent: "#b88c48",
};

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Root layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          padding: "4rem 1.5rem",
          textAlign: "center",
          background: palette.background,
          color: palette.foreground,
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <title>Something went wrong — OffScript</title>

        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          OFFSCRIPT
        </span>

        <p
          style={{
            margin: "3rem 0 0",
            color: palette.accent,
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          Something broke
        </p>

        <h1
          style={{
            margin: "1rem 0 0",
            maxWidth: "20ch",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(2.4rem, 7vw, 3.6rem)",
            fontWeight: 400,
            lineHeight: 1.03,
            letterSpacing: "-0.02em",
          }}
        >
          We lost our train of thought.
        </h1>

        <p
          style={{
            margin: "1.15rem 0 0",
            maxWidth: "44ch",
            color: palette.muted,
            fontSize: "0.95rem",
            lineHeight: 1.65,
          }}
        >
          OffScript failed to start. Your streak and saved challenges are
          untouched — reloading usually clears it.
        </p>

        <button
          type="button"
          onClick={() => retry()}
          style={{
            marginTop: "2.5rem",
            height: "3rem",
            padding: "0 1.5rem",
            border: "none",
            borderRadius: "0.75rem",
            background: palette.primary,
            color: palette.primaryText,
            fontSize: "0.9rem",
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          Try again
        </button>

        {error.digest && (
          <p
            style={{
              marginTop: "2.5rem",
              color: palette.muted,
              fontFamily: "'SFMono-Regular', Consolas, Menlo, monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.04em",
              opacity: 0.75,
            }}
          >
            Reference: {error.digest}
          </p>
        )}
      </body>
    </html>
  );
}
