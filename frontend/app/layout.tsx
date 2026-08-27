import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  // Lets relative URLs in metadata resolve, and keeps canonical links in step
  // with sitemap.ts / robots.ts.
  metadataBase: new URL(SITE_URL),
  title: "OffScript — Speak Without a Script",
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: "/",
    title: "OffScript — Speak Without a Script",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "OffScript — Speak Without a Script",
    description: SITE_DESCRIPTION,
  },
};

// Nudges Clerk's hosted UI toward the OffScript palette without pulling in a
// second component/design system.
const clerkAppearance = {
  variables: {
    colorPrimary: "#18201f",
    colorText: "#202524",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-manrope), sans-serif",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${instrumentSerif.variable}`}>
      <body>
        <ClerkProvider appearance={clerkAppearance}>
          {children}
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
