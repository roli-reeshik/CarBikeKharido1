"use client";

import { CalendarCheck, IndianRupee, MapPin, ShoppingCart } from "lucide-react";
import { useState } from "react";

import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

interface BrandBottomBarProps {
  brandName: string;
}

const actions = [
  { id: "dealer", label: "Find a Dealer", Icon: MapPin },
  { id: "test-drive", label: "Test Drive", Icon: CalendarCheck },
  { id: "prices", label: "Prices", Icon: IndianRupee },
  { id: "buy", label: "Book Online", Icon: ShoppingCart },
] as const;

type ActionId = (typeof actions)[number]["id"];

function DealerModal({ brandName, onClose }: { brandName: string; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-label={`Find a ${brandName} dealer`}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Find a {brandName} Dealer
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Visit your nearest authorised {brandName} showroom in Lucknow and other cities.
        </p>
        <div className="mt-4 space-y-2">
          {["Lucknow", "New Delhi", "Mumbai", "Bengaluru", "Pune"].map((city) => (
            <button
              key={city}
              type="button"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <MapPin className="mr-2 inline-block size-4 text-slate-400" aria-hidden />
              {brandName} — {city}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function TestDriveModal({ brandName, onClose }: { brandName: string; onClose: () => void }) {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div
      role="dialog"
      aria-label={`Request a ${brandName} test drive`}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Request a Test Drive
        </h3>
        {submitted ? (
          <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
            Thank you! A {brandName} dealer in Lucknow will contact you shortly.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <input
              type="tel"
              placeholder="10-digit mobile"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <button
              type="button"
              disabled={phone.length < 10}
              onClick={() => setSubmitted(true)}
              className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
            >
              Submit Request
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export function BrandBottomBar({ brandName }: BrandBottomBarProps) {
  const [openModal, setOpenModal] = useState<ActionId | null>(null);

  const handleAction = (id: ActionId) => {
    switch (id) {
      case "dealer":
      case "test-drive":
        setOpenModal(id);
        break;
      case "prices":
        document.getElementById("brand-carousel")?.scrollIntoView({ behavior: "smooth" });
        break;
      case "buy": {
        const msg = encodeURIComponent(
          `Hi, I'm interested in ${brandName} vehicles on ${siteConfig.name}. Please share more details.`,
        );
        window.open(`https://wa.me/919140878191?text=${msg}`, "_blank");
        break;
      }
    }
  };

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-700/50 bg-[#002c5f] shadow-2xl">
        <div className="mx-auto flex max-w-4xl items-center justify-around px-3 py-2.5 sm:px-6 sm:py-3">
          {actions.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleAction(id)}
              className="flex flex-col items-center gap-1 text-white/90 transition-colors hover:text-white"
            >
              <Icon className="size-5 sm:size-6" aria-hidden />
              <span className="text-[10px] font-medium leading-none sm:text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {openModal === "dealer" && (
        <DealerModal brandName={brandName} onClose={() => setOpenModal(null)} />
      )}
      {openModal === "test-drive" && (
        <TestDriveModal brandName={brandName} onClose={() => setOpenModal(null)} />
      )}
    </>
  );
}
