"use client";

import { Download, MapPin, Phone } from "lucide-react";
import { useState } from "react";

import { EmiCalculatorWidget } from "@/components/EmiCalculatorWidget";
import { siteConfig } from "@/lib/siteConfig";
import type { InsuranceRule, RtoTaxRule, VehicleWithRelations } from "@/lib/catalogue/types";

export function VdpMoreTools({
  vehicle,
  rtoRules,
  insuranceRules,
}: {
  vehicle: VehicleWithRelations;
  rtoRules: RtoTaxRule[];
  insuranceRules: InsuranceRule[];
}) {
  const [brochureNote, setBrochureNote] = useState("");

  const downloadBrochure = () => {
    const lines = [
      `${siteConfig.name} — ${vehicle.brand} ${vehicle.name}`,
      siteConfig.copyright,
      "",
      vehicle.bestForHeadline,
      `Body: ${vehicle.bodyType}`,
      `Real-world mileage: ${vehicle.realMileageKmPerLitre}`,
      "",
      `Principal Developer: ${siteConfig.developer.name}`,
      `Contact: ${siteConfig.contact.mobile} · ${siteConfig.contact.email}`,
      siteConfig.address.full,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${vehicle.slug}-brochure.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setBrochureNote("Plain-English spec sheet saved to your downloads.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={downloadBrochure}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <Download className="size-4" aria-hidden />
          Download brochure
        </button>
        <a
          href={siteConfig.contact.mobileHref}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <Phone className="size-4" aria-hidden />
          Call a dealer
        </a>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${vehicle.brand} dealer ${siteConfig.address.city}`)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <MapPin className="size-4" aria-hidden />
          Dealer locator
        </a>
      </div>
      {brochureNote ? (
        <p className="text-xs text-emerald-700 dark:text-emerald-400">{brochureNote}</p>
      ) : null}

      <EmiCalculatorWidget rtoRules={rtoRules} insuranceRules={insuranceRules} />
    </div>
  );
}
