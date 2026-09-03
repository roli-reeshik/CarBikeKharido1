import { Play } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { CarGallery } from "@/components/detail/CarGallery";
import { OnRoadQuote } from "@/components/detail/OnRoadQuote";
import { ProvenanceNote } from "@/components/detail/ProvenanceNote";
import { ReviewPanel } from "@/components/detail/ReviewPanel";
import { RivalGrid } from "@/components/detail/RivalGrid";
import { SpecTable } from "@/components/detail/SpecTable";
import { VariantTable } from "@/components/detail/VariantTable";
import { VehicleHero } from "@/components/detail/VehicleHero";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SelectedVehicleProvider } from "@/components/providers/SelectedVehicleProvider";
import { PriceHero } from "@/components/vdp/PriceHero";
import { SidebarWidgets } from "@/components/vdp/SidebarWidgets";
import { VdpMoreTools } from "@/components/vdp/VdpMoreTools";
import { VehicleDetailsLayout } from "@/components/vdp/VehicleDetailsLayout";
import { VehicleReviewSection } from "@/components/vdp/VehicleReviewSection";
import { VehicleSubNav } from "@/components/vdp/VehicleSubNav";
import { carDetails } from "@/lib/carDetails";
import { vehicleAccent } from "@/lib/catalogue/copy";
import {
  getPricingRules,
  getServiceCities,
  getVehicleBySlug,
  getVehicles,
} from "@/lib/catalogue/repository";
import {
  headlineVariant,
  priceRangePaise,
  type VehicleType,
  type VehicleWithRelations,
} from "@/lib/catalogue/types";
import { resolveVehicleMedia } from "@/lib/ingestion/imageResolver";
import { formatPaiseCompact } from "@/lib/money";
import { fetchRapidSpecs, specsFromRapidMatch } from "@/lib/providers/rapidapi";
import { vehiclePath } from "@/lib/routes";
import { siteConfig } from "@/lib/siteConfig";
import type { Variant as DetailVariant } from "@/lib/types";
import { getVehicleImageSrc, toCarPhotos } from "@/utils/getVehicleImage";
import {
  getOwnerReviews,
  getReviewSections,
  getSpecGroups,
  getVdpVideos,
  UPCOMING_BIKES,
  UPCOMING_SIMILARS,
  type VdpSimilar,
} from "@/lib/vdpContent";

function toDetailVariants(vehicle: VehicleWithRelations): DetailVariant[] {
  const gearboxLabels: Record<string, string> = {
    MANUAL: "Manual",
    AUTO_AMT: "Automatic (AMT)",
    AUTO_TORQUE_CONVERTER: "Automatic",
    EV: "Single-speed",
  };
  const fuelLabels: Record<string, string> = {
    PETROL: "Petrol",
    DIESEL: "Diesel",
    CNG: "CNG",
    ELECTRIC: "Electric",
    HYBRID: "Hybrid",
  };

  return vehicle.variants
    .slice()
    .sort((a, b) => a.exShowroomPricePence - b.exShowroomPricePence)
    .map((variant) => ({
      id: variant.id,
      name: variant.name,
      exShowroom: Math.round(variant.exShowroomPricePence / 100),
      gearbox: gearboxLabels[variant.transmissionType] ?? variant.transmissionType,
      fuel: fuelLabels[variant.fuelType] ?? variant.fuelType,
      headline: variant.isPopular
        ? "The trim most buyers actually choose."
        : `${variant.seatingCapacity}-seat ${fuelLabels[variant.fuelType] ?? variant.fuelType}`,
      keyKit: [],
      isValuePick: variant.isPopular,
    }));
}

function similarFromPool(
  pool: VehicleWithRelations[],
  current: VehicleWithRelations,
  kind: VdpSimilar["kind"],
): VdpSimilar[] {
  return pool
    .filter((item) => item.slug !== current.slug && item.type === current.type)
    .map((item) => {
      const [from] = priceRangePaise(item);
      return {
        slug: item.slug,
        name: item.name,
        brand: item.brand,
        priceLabel: `From ${formatPaiseCompact(from)}`,
        imageUrl: getVehicleImageSrc(item.slug),
        kind,
      };
    });
}

export async function vdpStaticParams(type: VehicleType) {
  const vehicles = await getVehicles();
  return vehicles.filter((vehicle) => vehicle.type === type).map((vehicle) => ({
    slug: vehicle.slug,
  }));
}

export async function vdpMetadata(slug: string): Promise<Metadata> {
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return { title: "Vehicle not found" };
  const [from] = priceRangePaise(vehicle);
  return {
    title: `${vehicle.name} — on-road price, specs & reviews`,
    description: `${vehicle.bodyType} from ${formatPaiseCompact(from)} ex-showroom on ${siteConfig.name}. On-road price for your city, variants, and a plain-English review.`,
    authors: [{ name: siteConfig.developer.name }],
    creator: siteConfig.developer.name,
    publisher: siteConfig.owner,
    other: {
      copyright: siteConfig.copyright,
      "contact:phone_number": siteConfig.contact.mobile,
      "contact:email": siteConfig.contact.email,
      "registered-address": siteConfig.address.full,
    },
  };
}

export async function VehicleDetailsPage({
  slug,
  expectedType,
}: {
  slug: string;
  expectedType?: VehicleType;
}) {
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  if (expectedType && vehicle.type !== expectedType) {
    permanentRedirect(vehiclePath(vehicle));
  }

  const [allVehicles, { rtoRules, rtoRates, insuranceRules }] = await Promise.all([
    getVehicles(),
    getPricingRules(),
  ]);
  const cities = getServiceCities();
  const [media, rapid] = await Promise.all([
    resolveVehicleMedia(vehicle),
    fetchRapidSpecs(vehicle),
  ]);
  const photos =
    media.photos.length > 0 ? media.photos : toCarPhotos(vehicle.slug);
  const editorial = carDetails[vehicle.slug];
  const specGroups = [
    ...getSpecGroups(vehicle),
    ...(rapid ? specsFromRapidMatch(rapid) : []),
  ];
  const reviews = getReviewSections(vehicle, photos);
  const videos = getVdpVideos(vehicle);
  const headline = headlineVariant(vehicle);

  const similar: VdpSimilar[] = [
    ...similarFromPool(allVehicles, vehicle, "trending"),
    ...similarFromPool([...allVehicles].reverse(), vehicle, "latest"),
    ...(vehicle.type === "BIKE" ? UPCOMING_BIKES : UPCOMING_SIMILARS),
  ];

  const compareWith = allVehicles
    .filter((item) => item.slug !== vehicle.slug && item.type === vehicle.type)
    .slice(0, 4)
    .map((item) => ({ slug: item.slug, label: item.name }));

  const sponsor =
    vehicle.type === "BIKE"
      ? {
          title: "Electric commuter week",
          blurb: "Try a silent scooter on your actual office route — we bring it to the gate.",
          cta: "Book an EV test ride",
        }
      : {
          title: "Toyota Innova Hycross campaign",
          blurb: "A weekender MPV with a hybrid heart. Same honest on-road maths we use here.",
          cta: "See the family hauler",
        };

  return (
    <SelectedVehicleProvider vehicles={allVehicles} initialSlug={vehicle.slug}>
      <a
        href="#overview"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to vehicle details
      </a>

      <Navbar />
      <VehicleSubNav modelName={vehicle.name} compareWith={compareWith} />

      <main className="flex-1">
        <VehicleDetailsLayout
          main={
            <>
              <section id="overview" className="scroll-mt-36 space-y-5">
                <PriceHero
                  vehicle={vehicle}
                  rtoRules={rtoRules}
                  rtoRates={rtoRates}
                  insuranceRules={insuranceRules}
                />
                <div className="space-y-4">
                  {reviews.map((section) => (
                    <VehicleReviewSection key={section.id} section={section} />
                  ))}
                </div>
              </section>

              <section id="price" className="scroll-mt-36">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  On-road price in your city
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Switch the variant or the city. Every line recalculates — including
                  road tax for {cities[0].stateName} and beyond.
                </p>
                <div className="mt-5">
                  <OnRoadQuote
                    vehicle={vehicle}
                    cities={cities}
                    rtoRules={rtoRules}
                    rtoRates={rtoRates}
                    insuranceRules={insuranceRules}
                    initialVariantId={headline.id}
                    initialCityId={cities[0].id}
                  />
                </div>
              </section>

              <section id="compare" className="scroll-mt-36">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Compare with rivals
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Same questions every buyer asks — not a 40-row spreadsheet.
                </p>
                <div className="mt-5">
                  {editorial?.rivals?.length ? (
                    <RivalGrid rivals={editorial.rivals} carName={vehicle.name} />
                  ) : (
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {compareWith.map((item) => (
                        <li key={item.slug}>
                          <Link
                            href={vehiclePath({
                              type: vehicle.type,
                              slug: item.slug,
                            })}
                            className="block rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm font-medium hover:border-orange-300 dark:border-slate-800 dark:bg-slate-900/60"
                          >
                            {vehicle.name} vs {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>

              <section id="images" className="scroll-mt-36">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Images
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Exterior, colour and press photography — credited on each frame.
                </p>
                <div className="mt-5">
                  <CarGallery
                    photos={photos}
                    alt={vehicle.name}
                    bodyStyle={vehicle.bodyType}
                    accentKey={vehicleAccent(vehicle.slug)}
                  />
                </div>
              </section>

              <section id="specs" className="scroll-mt-36">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Specifications
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Raw figures, then what they mean when you live with the vehicle.
                </p>
                <div className="mt-5">
                  <SpecTable groups={specGroups} />
                </div>
              </section>

              <section id="reviews" className="scroll-mt-36">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  User reviews
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  What owners keep praising — and what they quietly regret.
                </p>
                <div className="mt-5">
                  <ReviewPanel reviews={getOwnerReviews(vehicle)} />
                </div>
              </section>

              <section id="view360" className="scroll-mt-36">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  360° view
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Spin the studio render. Change the paint from the swatches.
                </p>
                <div className="mt-5">
                  <VehicleHero vehicle={vehicle} photos={photos} />
                </div>
              </section>

              <section id="variants" className="scroll-mt-36">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Variants
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Trim-by-trim price and the kit that actually arrives with it.
                </p>
                <div className="mt-5">
                  <VariantTable
                    variants={editorial?.variants ?? toDetailVariants(vehicle)}
                  />
                </div>
              </section>

              <section id="videos" className="scroll-mt-36">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Videos
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  First-drive impressions and owner diaries — produced for{" "}
                  {siteConfig.name}.
                </p>
                <ul className="mt-5 grid gap-4 sm:grid-cols-3">
                  {videos.map((video, index) => (
                    <li
                      key={video.id}
                      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-950 text-white dark:border-slate-800"
                    >
                      <div className="relative aspect-video">
                        {photos[index % Math.max(photos.length, 1)] ? (
                          <Image
                            src={photos[index % photos.length].src}
                            alt=""
                            fill
                            sizes="33vw"
                            className="object-cover opacity-70"
                          />
                        ) : (
                          <div className="size-full bg-slate-800" />
                        )}
                        <span className="absolute inset-0 grid place-items-center">
                          <span className="grid size-12 place-items-center rounded-full bg-white/90 text-slate-900">
                            <Play className="size-5 fill-current" aria-hidden />
                          </span>
                        </span>
                        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold">
                          {video.duration}
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium">{video.title}</p>
                        <p className="mt-1 text-xs text-slate-300">{video.blurb}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section id="more" className="scroll-mt-36">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Brochure, EMI & dealers
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Tools for the last mile before you book a test drive.
                </p>
                <div className="mt-5">
                  <VdpMoreTools
                    vehicle={vehicle}
                    rtoRules={rtoRules}
                    rtoRates={rtoRates}
                    insuranceRules={insuranceRules}
                  />
                </div>
              </section>

              <ProvenanceNote
                dataSource={rapid ? "rapidapi" : "sample"}
                photoSource={media.source}
              />
            </>
          }
          sidebar={
            <SidebarWidgets similar={similar} sponsor={sponsor} />
          }
        />
      </main>

      <Footer />
    </SelectedVehicleProvider>
  );
}
