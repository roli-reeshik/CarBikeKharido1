import { Bike, Car } from "lucide-react";

import { VariantEditor } from "@/components/admin/VariantEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { isDatabaseConfigured } from "@/lib/catalogue/prisma";
import { getVehicles } from "@/lib/catalogue/repository";
import { formatPaiseCompact } from "@/lib/money";
import { priceRangePaise } from "@/lib/catalogue/types";

export default async function AdminVariantsPage() {
  const vehicles = await getVehicles();
  const readOnly = !isDatabaseConfigured();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
        Variants &amp; prices
      </h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Enter prices in rupees. Marking a trim as most bought clears the flag on
        the rest of that line-up.
      </p>

      <div className="mt-6 space-y-5">
        {vehicles.map((vehicle) => {
          const [from, to] = priceRangePaise(vehicle);
          const TypeIcon = vehicle.type === "BIKE" ? Bike : Car;

          return (
            <section
              key={vehicle.id}
              className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/50"
            >
              <header className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                  <TypeIcon className="size-4 shrink-0" aria-hidden />
                  {vehicle.name}
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {vehicle.bodyType} · {formatPaiseCompact(from)} –{" "}
                  {formatPaiseCompact(to)}
                </span>
              </header>

              <div className="mt-2">
                {vehicle.variants
                  .slice()
                  .sort(
                    (a, b) => a.exShowroomPricePence - b.exShowroomPricePence,
                  )
                  .map((variant) => (
                    <VariantEditor
                      key={variant.id}
                      variant={variant}
                      disabled={readOnly}
                    />
                  ))}
              </div>

              <ImageUploader vehicleId={vehicle.id} disabled={readOnly} />
            </section>
          );
        })}
      </div>
    </div>
  );
}
