/**
 * Data access for the vehicle catalogue.
 *
 * Every function reads from PostgreSQL through Prisma when `DATABASE_URL` is
 * set, and otherwise serves the bundled dataset in `seedData.ts`. That fallback
 * is deliberate rather than a shortcut: it lets the site build, render and be
 * reviewed with no infrastructure attached, and it means a database outage
 * degrades the catalogue to slightly stale content instead of a 500 page.
 *
 * Prisma returns BigInt for money columns and Decimal for percentages. Both are
 * converted to plain numbers here, at the boundary, so nothing downstream has to
 * know which source it is reading from.
 */
import "server-only";

import { bigIntToPaise } from "../money";
import { getPrisma } from "./prisma";
import {
  insuranceRules as seedInsuranceRules,
  rtoTaxRules as seedRtoTaxRules,
  serviceCities as seedServiceCities,
  vehicles as seedVehicles,
} from "./seedData";
import type {
  InsuranceRule,
  RtoTaxRule,
  ServiceCity,
  VehicleType,
  VehicleWithRelations,
} from "./types";

/** Prisma's Decimal has a toString; Number() on it is exact for our precision. */
const toNumber = (value: unknown): number => Number(value);

type PrismaVehicle = NonNullable<
  Awaited<ReturnType<typeof fetchVehiclesFromDb>>
>[number];

async function fetchVehiclesFromDb() {
  const prisma = getPrisma();
  if (!prisma) return null;

  return prisma.vehicle.findMany({
    include: { variants: true, colors: true, images: true },
    orderBy: { name: "asc" },
  });
}

function mapVehicle(row: PrismaVehicle): VehicleWithRelations {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    type: row.type as VehicleType,
    brand: row.brand,
    bodyType: row.bodyType,
    safetyRatingNCAP: row.safetyRatingNCAP,
    isElectric: row.isElectric,
    luggageCapacityBags: row.luggageCapacityBags,
    realMileageKmPerLitre: toNumber(row.realMileageKmPerLitre),
    bestForHeadline: row.bestForHeadline,
    variants: row.variants.map((variant) => ({
      id: variant.id,
      vehicleId: variant.vehicleId,
      name: variant.name,
      fuelType: variant.fuelType,
      transmissionType: variant.transmissionType,
      exShowroomPricePence: bigIntToPaise(variant.exShowroomPricePence),
      engineCc: variant.engineCc,
      seatingCapacity: variant.seatingCapacity,
      isPopular: variant.isPopular,
    })),
    colors: row.colors.map((color) => ({
      id: color.id,
      vehicleId: color.vehicleId,
      name: color.name,
      hexCode: color.hexCode,
      imaginStudioColorCode: color.imaginStudioColorCode,
      oemPaintName: color.oemPaintName,
    })),
    images: row.images.map((image) => ({
      id: image.id,
      vehicleId: image.vehicleId,
      url: image.url,
      type: image.type,
      caption: image.caption,
    })),
  };
}

let warnedAboutFallback = false;

/** Logs the no-database fallback once, so it is visible but not noisy. */
function noteFallback(reason: string) {
  if (warnedAboutFallback) return;
  warnedAboutFallback = true;
  console.info(`[catalogue] Serving bundled seed data (${reason}).`);
}

export async function getVehicles(): Promise<VehicleWithRelations[]> {
  try {
    const rows = await fetchVehiclesFromDb();
    if (rows && rows.length > 0) return rows.map(mapVehicle);
    if (rows) noteFallback("database is empty — run `npm run db:seed`");
    else noteFallback("DATABASE_URL is not set");
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    noteFallback(`database unreachable: ${reason}`);
  }

  return seedVehicles;
}

export async function getVehicleBySlug(
  slug: string,
): Promise<VehicleWithRelations | null> {
  const vehicles = await getVehicles();
  return vehicles.find((vehicle) => vehicle.slug === slug) ?? null;
}

export async function getVehiclesByType(
  type: VehicleType,
): Promise<VehicleWithRelations[]> {
  const vehicles = await getVehicles();
  return vehicles.filter((vehicle) => vehicle.type === type);
}

export async function getRtoTaxRules(): Promise<RtoTaxRule[]> {
  const prisma = getPrisma();
  if (!prisma) return seedRtoTaxRules;

  try {
    const rows = await prisma.rtoTaxRule.findMany({
      orderBy: [{ stateCode: "asc" }, { priceMin: "asc" }],
    });
    if (rows.length === 0) return seedRtoTaxRules;

    return rows.map((row) => ({
      id: row.id,
      stateCode: row.stateCode,
      vehicleType: row.vehicleType as VehicleType,
      fuelType: row.fuelType,
      priceMin: bigIntToPaise(row.priceMin),
      priceMax: bigIntToPaise(row.priceMax),
      taxPercentage: toNumber(row.taxPercentage),
      cessPercentage: toNumber(row.cessPercentage),
      fixedFee: bigIntToPaise(row.fixedFee),
    }));
  } catch {
    return seedRtoTaxRules;
  }
}

export async function getInsuranceRules(): Promise<InsuranceRule[]> {
  const prisma = getPrisma();
  if (!prisma) return seedInsuranceRules;

  try {
    const rows = await prisma.insuranceRule.findMany();
    if (rows.length === 0) return seedInsuranceRules;

    return rows.map((row) => ({
      id: row.id,
      vehicleType: row.vehicleType as VehicleType,
      engineCcMin: row.engineCcMin,
      engineCcMax: row.engineCcMax,
      baseThirdParty1Yr: bigIntToPaise(row.baseThirdParty1Yr),
      ownDamagePercentage: toNumber(row.ownDamagePercentage),
      mandatoryCpaFee: bigIntToPaise(row.mandatoryCpaFee),
    }));
  } catch {
    return seedInsuranceRules;
  }
}

/**
 * Cities are a fixed launch list rather than a table: adding one is a product
 * decision that also needs tax slabs and dealer coverage, not a data edit.
 */
export function getServiceCities(): ServiceCity[] {
  return seedServiceCities;
}

export function getServiceCity(id: string): ServiceCity {
  return (
    seedServiceCities.find((city) => city.id === id) ?? seedServiceCities[0]
  );
}

/** Convenience bundle for anything that needs to price a vehicle. */
export async function getPricingRules() {
  const [rtoRules, insuranceRules] = await Promise.all([
    getRtoTaxRules(),
    getInsuranceRules(),
  ]);
  return { rtoRules, insuranceRules };
}
