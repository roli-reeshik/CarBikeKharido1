import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BrandBottomBar } from "@/components/brand/BrandBottomBar";
import { BrandVehicleCarousel } from "@/components/brand/BrandVehicleCarousel";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { brands, getBrand, getVehiclesForBrand } from "@/lib/brandData";
import { siteConfig } from "@/lib/siteConfig";

export async function generateStaticParams() {
  return brands.map((b) => ({ brandSlug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}): Promise<Metadata> {
  const { brandSlug } = await params;
  const brand = getBrand(brandSlug);
  if (!brand) return {};
  const title = `${brand.name} Cars & Bikes`;
  return {
    title,
    description: `Browse every ${brand.name} vehicle on ${siteConfig.name}. On-road prices, specs and test drive booking — no jargon.`,
  };
}

export default async function BrandShowcasePage({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}) {
  const { brandSlug } = await params;
  const brand = getBrand(brandSlug);
  if (!brand) notFound();

  const vehicles = getVehiclesForBrand(brandSlug);

  const typeLabel =
    brand.type === "bike"
      ? "Two-Wheelers"
      : brand.type === "both"
        ? "Cars & Two-Wheelers"
        : "Cars";

  return (
    <>
      <Navbar />

      <main className="flex-1 pb-20">
        {/* ---- Brand header ---- */}
        <section className="relative isolate overflow-hidden bg-slate-950 pb-8 pt-14 sm:pb-12 sm:pt-20">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${brand.brandColor}, transparent)`,
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
            <span
              className="mx-auto mb-4 grid size-20 place-items-center rounded-2xl text-2xl font-bold text-white sm:size-24 sm:text-3xl"
              style={{ backgroundColor: brand.brandColor }}
              aria-hidden
            >
              {brand.logoInitials}
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {brand.name} {typeLabel}
            </h1>
            <p className="mt-2 text-sm text-white/60 sm:text-base">{brand.tagline}</p>
            <p className="mt-1 text-xs text-white/40">
              {vehicles.length} {vehicles.length === 1 ? "model" : "models"} on{" "}
              {siteConfig.name}
            </p>
          </div>
        </section>

        {/* ---- Studio carousel ---- */}
        <section
          id="brand-carousel"
          className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        >
          {vehicles.length > 0 ? (
            <BrandVehicleCarousel vehicles={vehicles} />
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg font-medium text-slate-500 dark:text-slate-400">
                We are adding {brand.name} models to the catalogue soon.
              </p>
              <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
                Check back or browse other brands on {siteConfig.name}.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <BrandBottomBar brandName={brand.name} />
    </>
  );
}
