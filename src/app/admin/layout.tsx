import { Database, IndianRupee, LayoutDashboard, LogOut, Receipt } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AdminLogin } from "@/components/admin/AdminLogin";
import { signOut } from "@/lib/admin/actions";
import { isAdminConfigured, isSignedIn } from "@/lib/admin/auth";
import { isDatabaseConfigured } from "@/lib/catalogue/prisma";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Admin",
  // Internal tooling must never appear in search results.
  robots: { index: false, follow: false },
};

/**
 * Every admin response depends on the session cookie and on live catalogue
 * rows, so nothing here may be prerendered or cached between requests.
 */
export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/variants", label: "Variants & prices", icon: IndianRupee },
  { href: "/admin/rto", label: "RTO tax slabs", icon: Receipt },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isSignedIn())) {
    return <AdminLogin configured={isAdminConfigured()} />;
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-slate-200/70 bg-white dark:border-slate-800/80 dark:bg-slate-950">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="text-sm font-semibold text-slate-900 dark:text-white">
            {siteConfig.wordmark.lead}
            <span className="text-blue-600 dark:text-blue-400">
              {siteConfig.wordmark.accent}
            </span>
            <span className="ml-2 rounded-md bg-slate-900 px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-white dark:bg-white dark:text-slate-900">
              Admin
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-1" aria-label="Admin sections">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <item.icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            ))}
          </nav>

          <form action={signOut} className="ml-auto">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <LogOut className="size-4" aria-hidden />
              Sign out
            </button>
          </form>
        </div>
      </header>

      {!isDatabaseConfigured() ? (
        <p className="flex items-start gap-2 border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900 sm:px-6 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
          <Database className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            <strong className="font-semibold">Read-only.</strong> No database is
            connected, so the catalogue below is the bundled seed data and edits
            cannot be saved. Set <code>DATABASE_URL</code>, then run{" "}
            <code>npm run db:push &amp;&amp; npm run db:seed</code>.
          </span>
        </p>
      ) : null}

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
