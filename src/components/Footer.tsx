"use client";

import { useState } from "react";
import { Bike, Car, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

import { AboutModal } from "@/components/AboutModal";
import { siteConfig } from "@/lib/siteConfig";

const columns = [
  {
    title: "Cars",
    links: [
      "New cars",
      "Electric cars",
      "7-seaters",
      "Under ₹10 lakh",
      "5-star safety",
    ],
  },
  {
    title: "Bikes & scooters",
    links: [
      "Commuter bikes",
      "Electric scooters",
      "Cruisers",
      "Under ₹1 lakh",
      "Best mileage",
    ],
  },
  {
    title: "Work out the cost",
    links: [
      "On-road price by city",
      "EMI calculator",
      "Running cost per km",
      "Insurance explainer",
      "RTO tax by state",
    ],
  },
];

export function Footer() {
  const { address, contact, developer } = siteConfig;
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <footer className="border-t border-slate-200/70 bg-white dark:border-slate-800/80 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                <ShieldCheck className="size-5" aria-hidden />
              </span>
              <span className="text-[17px] font-semibold tracking-tight text-slate-900 dark:text-white">
                {siteConfig.wordmark.lead}
                <span className="text-blue-600 dark:text-blue-400">
                  {siteConfig.wordmark.accent}
                </span>
                <span className="text-slate-400 dark:text-slate-500">
                  {siteConfig.wordmark.suffix}
                </span>
              </span>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              We describe cars and bikes the way owners talk about them — how
              many bags fit, how tiring the traffic feels, and what the bill
              really comes to. No sponsored rankings.
            </p>

            <p className="mt-4 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Car className="size-3.5" aria-hidden />
                Cars
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Bike className="size-3.5" aria-hidden />
                Bikes &amp; scooters
              </span>
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                {column.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Statutory contact and ownership details */}
        <div className="mt-10 grid gap-6 border-t border-slate-200/70 pt-8 sm:grid-cols-2 lg:grid-cols-3 dark:border-slate-800/80">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Registered address
            </h2>
            <address className="mt-2 flex gap-2 text-sm not-italic leading-relaxed text-slate-600 dark:text-slate-400">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                {address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <span className="block">
                  {address.city}, {address.state} - {address.postalCode}
                </span>
              </span>
            </address>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Get in touch
            </h2>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href={contact.mobileHref}
                  className="inline-flex items-center gap-2 transition-colors hover:text-slate-900 dark:hover:text-white"
                >
                  <Phone className="size-4 shrink-0" aria-hidden />
                  {contact.mobile}
                </a>
              </li>
              <li>
                <a
                  href={contact.emailHref}
                  className="inline-flex items-center gap-2 break-all transition-colors hover:text-slate-900 dark:hover:text-white"
                >
                  <Mail className="size-4 shrink-0" aria-hidden />
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Built by
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {developer.name}
              <span className="block text-xs text-slate-500 dark:text-slate-500">
                {developer.role}, {siteConfig.owner}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200/70 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/80 dark:text-slate-400">
          <p>
            {siteConfig.copyright} {siteConfig.name} is a VidyaLabs platform.
          </p>
          <p className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setAboutOpen(true)}
              className="font-medium text-slate-700 underline-offset-2 hover:underline dark:text-slate-200"
            >
              About {siteConfig.name}
            </button>
            <span>
              Prices are indicative. Crash ratings sourced from Bharat NCAP and
              Global NCAP published results.
            </span>
          </p>
        </div>
      </div>
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </footer>
  );
}
