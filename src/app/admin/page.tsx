import { Bike, Car, IndianRupee, Receipt } from "lucide-react";
import Link from "next/link";

import {
  getInsuranceRules,
  getRtoTaxRules,
  getVehicles,
} from "@/lib/catalogue/repository";

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Car;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </span>
      <span className="mt-2 block text-2xl font-semibold text-slate-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}

export default async function AdminOverviewPage() {
  const [vehicles, rtoRules, insuranceRules] = await Promise.all([
    getVehicles(),
    getRtoTaxRules(),
    getInsuranceRules(),
  ]);

  const cars = vehicles.filter((vehicle) => vehicle.type === "CAR");
  const bikes = vehicles.filter((vehicle) => vehicle.type === "BIKE");
  const variantCount = vehicles.reduce(
    (total, vehicle) => total + vehicle.variants.length,
    0,
  );
  const states = new Set(rtoRules.map((rule) => rule.stateCode)).size;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
        Catalogue overview
      </h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Update prices and tax slabs without a code deploy.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Car} label="Cars" value={cars.length} />
        <Stat icon={Bike} label="Bikes & scooters" value={bikes.length} />
        <Stat icon={IndianRupee} label="Variants" value={variantCount} />
        <Stat
          icon={Receipt}
          label="Tax bands"
          value={`${rtoRules.length} across ${states} states`}
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/variants"
          className="rounded-2xl border border-slate-200/80 bg-white/70 p-5 transition-shadow hover:shadow-micro dark:border-slate-800 dark:bg-slate-900/50"
        >
          <h2 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <IndianRupee className="size-4" aria-hidden />
            Variants &amp; prices
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Change ex-showroom prices and flag the trim most buyers choose.
          </p>
        </Link>

        <Link
          href="/admin/rto"
          className="rounded-2xl border border-slate-200/80 bg-white/70 p-5 transition-shadow hover:shadow-micro dark:border-slate-800 dark:bg-slate-900/50"
        >
          <h2 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <Receipt className="size-4" aria-hidden />
            RTO tax slabs
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Apply a state notification the day it lands. {insuranceRules.length}{" "}
            insurance bands are seeded alongside.
          </p>
        </Link>
      </div>
    </div>
  );
}
