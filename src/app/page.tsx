import { FinancialSuite } from "@/components/FinancialSuite";
import { Footer } from "@/components/Footer";
import { HeroSearch } from "@/components/HeroSearch";
import { Navbar } from "@/components/Navbar";
import { SelectedVehicleProvider } from "@/components/providers/SelectedVehicleProvider";
import { QuickCategoryGrid } from "@/components/QuickCategoryGrid";
import { QuickCompare } from "@/components/QuickCompare";
import { TrendingVehicles } from "@/components/TrendingVehicles";
import { getPricingRules, getVehicles } from "@/lib/catalogue/repository";

export default async function HomePage() {
  const [vehicles, { rtoRules, rtoRates, insuranceRules }] = await Promise.all([
    getVehicles(),
    getPricingRules(),
  ]);

  return (
    <SelectedVehicleProvider vehicles={vehicles}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main" className="flex-1">
        <HeroSearch vehicles={vehicles} />
        <QuickCategoryGrid vehicles={vehicles} />
        <TrendingVehicles vehicles={vehicles} />
        <FinancialSuite
          vehicles={vehicles}
          rtoRules={rtoRules}
          rtoRates={rtoRates}
          insuranceRules={insuranceRules}
        />
        <QuickCompare vehicles={vehicles} />
      </main>

      <Footer />
    </SelectedVehicleProvider>
  );
}
