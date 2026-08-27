import type { Metadata } from "next";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = { title: "Sign in — OffScript" };

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-5 py-16">
      <Link
        href="/"
        className="text-sm font-bold uppercase tracking-[0.2em] text-foreground"
      >
        OFFSCRIPT
      </Link>
      <SignIn />
    </main>
  );
}
