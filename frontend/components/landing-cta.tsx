import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Marketing call to action. Server-rendered from the session, so a signed-in
 * visitor is never asked to "get started" again.
 *
 * Deliberately not a Client Component — this markup must exist in the initial
 * HTML for both crawlers and first paint.
 */
export function LandingCta({
  isSignedIn,
  className,
  signedOutLabel,
  signedInLabel = "Go to dashboard",
}: {
  isSignedIn: boolean;
  className?: string;
  signedOutLabel: string;
  signedInLabel?: string;
}) {
  return (
    <Link href={isSignedIn ? "/dashboard" : "/sign-up"} className={className}>
      {isSignedIn ? signedInLabel : signedOutLabel} <ArrowRight size={18} />
    </Link>
  );
}
