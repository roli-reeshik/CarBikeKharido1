import { CatalogueBrowse } from "@/components/CatalogueBrowse";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SelectedVehicleProvider } from "@/components/providers/SelectedVehicleProvider";
import { getVehicles } from "@/lib/catalogue/repository";
import { parseCatalogQuery } from "@/lib/catalogue/filters";
import { siteConfig } from "@/lib/siteConfig";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `New cars — on-road price in plain English`,
  description: `Browse SUVs, hatchbacks, sedans and MUVs on ${siteConfig.name}. Every rupee on the invoice explained.`,
};

export default async function CarsIndexPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [vehicles, raw] = await Promise.all([getVehicles(), searchParams]);
  const query = parseCatalogQuery(raw);

  return (
    <SelectedVehicleProvider vehicles={vehicles}>
      <a
        href="#catalogue"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to catalogue
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <CatalogueBrowse vehicles={vehicles} segment="CAR" query={query} />
      </main>
      <Footer />
    </SelectedVehicleProvider>
  );
}
