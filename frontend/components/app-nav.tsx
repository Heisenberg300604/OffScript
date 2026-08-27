import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

/**
 * V1 navigation. Every entry resolves to a real route — no placeholder anchors.
 */
const LINKS = [
  { href: "/dashboard", label: "Today" },
  { href: "/progress", label: "Progress" },
  { href: "/history", label: "History" },
] as const;

type Current = "/dashboard" | "/progress" | "/history";

export function AppNav({ current }: { current: Current }) {
  return (
    <nav className="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-background/85 px-5 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-8">
        <Link
          href="/dashboard"
          className="text-sm font-bold uppercase tracking-[0.18em] text-foreground"
        >
          OFFSCRIPT
        </Link>
        <div className="hidden h-full items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={current === link.href ? "page" : undefined}
              className={
                current === link.href
                  ? "rounded-lg bg-secondary px-3 py-1.5 text-sm font-semibold text-foreground"
                  : "rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Clerk owns the avatar, account management and sign-out. */}
      <UserButton
        appearance={{ elements: { avatarBox: "size-8" } }}
      />
    </nav>
  );
}

/** Mobile tab bar — same three destinations, thumb-reachable. */
export function AppTabBar({ current }: { current: Current }) {
  return (
    <div className="fixed bottom-0 left-0 z-50 flex w-full border-t border-border bg-background/95 backdrop-blur-md md:hidden">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={current === link.href ? "page" : undefined}
          className={
            current === link.href
              ? "flex flex-1 justify-center py-3.5 text-sm font-semibold text-foreground"
              : "flex flex-1 justify-center py-3.5 text-sm text-muted-foreground"
          }
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
