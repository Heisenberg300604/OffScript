"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

/**
 * Landing header + mobile menu.
 *
 * This is a Client Component only because of the mobile menu toggle. Auth state
 * arrives as a prop resolved on the server, so the correct CTA is present in the
 * server-rendered HTML — no empty nav on first paint, and crawlers see the real
 * call to action.
 */
export function LandingHeader({ isSignedIn }: { isSignedIn: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <>
      <header className="landing-nav">
        <Link href="/" className="landing-logo">
          OFFSCRIPT
        </Link>

        <nav className="landing-links" aria-label="Main navigation">
          <a href="#practice">Practice</a>
          <a href="#progress">Progress</a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <div className="landing-actions">
          {isSignedIn ? (
            <>
              <Link href="/dashboard" className="landing-nav-cta">
                Dashboard <ArrowRight size={15} />
              </Link>
              <UserButton appearance={{ elements: { avatarBox: "size-8" } }} />
            </>
          ) : (
            <>
              <Link href="/sign-in" className="landing-signin">
                Sign in
              </Link>
              <Link href="/sign-up" className="landing-nav-cta">
                Get started <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="landing-menu-button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {menuOpen && (
        <nav className="landing-mobile-menu" aria-label="Mobile navigation">
          <a href="#practice" onClick={close}>
            Practice
          </a>
          <a href="#progress" onClick={close}>
            Progress
          </a>
          <a href="#how-it-works" onClick={close}>
            How it works
          </a>
          {isSignedIn ? (
            <Link href="/dashboard" onClick={close}>
              Go to dashboard <ArrowRight size={15} />
            </Link>
          ) : (
            <Link href="/sign-up" onClick={close}>
              Get started <ArrowRight size={15} />
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
