import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppProviders } from "@/components/providers/AppProviders";
import { buildOrganisationJsonLd, siteConfig } from "@/lib/siteConfig";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.developer.name }],
  creator: siteConfig.developer.name,
  publisher: siteConfig.owner,
  keywords: [
    siteConfig.name,
    "new cars",
    "used cars",
    "bikes",
    "on-road price",
    siteConfig.owner,
  ],
  category: "automotive",
  other: {
    copyright: siteConfig.copyright,
    "contact:phone_number": siteConfig.contact.mobile,
    "contact:email": siteConfig.contact.email,
    "geo.placename": siteConfig.address.city,
    "geo.region": "IN-UP",
    developer: `${siteConfig.developer.name}, ${siteConfig.developer.role}`,
    "registered-address": siteConfig.address.full,
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    locale: "en_IN",
  },
};

/**
 * Applies the stored theme before first paint so a dark-mode visitor never sees
 * a white flash.
 */
const themeScript = `
try {
  var stored = localStorage.getItem('cbk.theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (stored === 'dark' || (!stored && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
} catch (error) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildOrganisationJsonLd()),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
