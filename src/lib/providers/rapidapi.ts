/**
 * RapidAPI adapter for API Ninjas cars + motorcycles.
 *
 * These feeds supply technical rows (displacement, economy, gearbox) — not
 * Indian on-road prices and not photographs. Prices stay on our pricing
 * engine; pictures go through `src/lib/ingestion/imageResolver.ts`.
 *
 * Coverage caveat: the cars catalogue is EPA-weighted. A miss is normal for
 * India-only nameplates; callers must keep editorial specs in that case.
 */
import type { SpecGroup } from "@/lib/types";
import {
  isRapidApiEnabled,
  rapidapiConfig,
} from "@/lib/providers/config";
import { fetchJson } from "@/lib/providers/http";
import {
  queryPlanFor,
  type RapidQueryAttempt,
} from "@/lib/ingestion/queryMap";
import type { VehicleType } from "@/lib/catalogue/types";

export interface RapidCarRow {
  city_mpg?: number;
  highway_mpg?: number;
  combination_mpg?: number;
  class?: string;
  cylinders?: number;
  displacement?: number;
  drive?: string;
  fuel_type?: string;
  make?: string;
  model?: string;
  transmission?: string;
  year?: number | string;
}

export interface RapidBikeRow {
  make?: string;
  model?: string;
  year?: string;
  type?: string;
  displacement?: string;
  engine?: string;
  power?: string;
  torque?: string;
  gearbox?: string;
  transmission?: string;
  cooling?: string;
  fuel_capacity?: string;
  fuel_consumption?: string;
  seat_height?: string;
  total_weight?: string;
  total_length?: string;
  wheelbase?: string;
  ground_clearance?: string;
  front_brakes?: string;
  starter?: string;
}

export interface RapidMatch {
  kind: VehicleType;
  query: RapidQueryAttempt;
  /** True when the returned nameplate is an alias, not the exact catalogue model. */
  approximate: boolean;
  row: RapidCarRow | RapidBikeRow;
}

function headers(host: string): Record<string, string> {
  return {
    "x-rapidapi-key": rapidapiConfig.apiKey ?? "",
    "x-rapidapi-host": host,
  };
}

function buildUrl(host: string, path: string, attempt: RapidQueryAttempt): string {
  const params = new URLSearchParams();
  if (attempt.make) params.set("make", attempt.make);
  if (attempt.model) params.set("model", attempt.model);
  if (attempt.year) params.set("year", attempt.year);
  return `https://${host}${path}?${params}`;
}

function pause(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function namesMatch(expected: string, actual: string | undefined): boolean {
  if (!actual) return false;
  const needle = expected.toLowerCase().replace(/[^a-z0-9]/g, "");
  const hay = actual.toLowerCase().replace(/[^a-z0-9]/g, "");
  return hay.includes(needle) || needle.includes(hay);
}

async function searchCars(attempt: RapidQueryAttempt): Promise<RapidCarRow[]> {
  const payload = await fetchJson<RapidCarRow[]>(
    buildUrl(rapidapiConfig.carsHost, "/v1/cars", attempt),
    { headers: headers(rapidapiConfig.carsHost), revalidate: 60 * 60 * 12 },
  );
  return Array.isArray(payload) ? payload : [];
}

async function searchBikes(attempt: RapidQueryAttempt): Promise<RapidBikeRow[]> {
  const payload = await fetchJson<RapidBikeRow[]>(
    buildUrl(rapidapiConfig.bikesHost, "/v1/motorcycles", attempt),
    { headers: headers(rapidapiConfig.bikesHost), revalidate: 60 * 60 * 12 },
  );
  return Array.isArray(payload) ? payload : [];
}

/**
 * First successful API Ninjas row for a catalogue vehicle, or null.
 */
/** Connectivity probe — a nameplate API Ninjas is known to carry. */
export async function probeRapidCars(): Promise<{
  ok: boolean;
  count: number;
  sample?: string;
}> {
  if (!isRapidApiEnabled()) return { ok: false, count: 0 };
  const rows = await searchCars({ make: "toyota", model: "corolla" });
  const first = rows[0];
  return {
    ok: rows.length > 0,
    count: rows.length,
    sample: first
      ? `${first.year ?? ""} ${first.make ?? ""} ${first.model ?? ""}`.trim()
      : undefined,
  };
}

export async function fetchRapidSpecs(vehicle: {
  slug: string;
  type: VehicleType;
  brand: string;
  name: string;
}): Promise<RapidMatch | null> {
  if (!isRapidApiEnabled()) return null;

  const plan = queryPlanFor(vehicle.slug, vehicle);

  for (const attempt of plan.attempts) {
    await pause(220);
    if (plan.type === "BIKE") {
      const rows = await searchBikes(attempt);
      const row = rows[0];
      if (!row) continue;
      return {
        kind: "BIKE",
        query: attempt,
        approximate: !namesMatch(attempt.model, row.model),
        row,
      };
    }

    const rows = await searchCars(attempt);
    const row = rows[0];
    if (!row) continue;
    return {
      kind: "CAR",
      query: attempt,
      approximate: !namesMatch(attempt.model, row.model),
      row,
    };
  }

  return null;
}

const MPG_TO_KML = 0.425144;

function mpgToKmL(mpg: number | undefined): string | undefined {
  if (typeof mpg !== "number" || !Number.isFinite(mpg)) return undefined;
  return `${(mpg * MPG_TO_KML).toFixed(1)} km/l`;
}

function litresToCc(litres: number | undefined): string | undefined {
  if (typeof litres !== "number" || !Number.isFinite(litres)) return undefined;
  return `${Math.round(litres * 1000)} cc`;
}

function fuelLabel(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const map: Record<string, string> = {
    gas: "Petrol",
    gasoline: "Petrol",
    diesel: "Diesel",
    electricity: "Electric",
    electric: "Electric",
  };
  return map[value.toLowerCase()] ?? value;
}

function gearboxLabel(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (value === "a" || /^auto/i.test(value)) return "Automatic";
  if (value === "m" || /^man/i.test(value)) return "Manual";
  return value;
}

export function specsFromRapidMatch(match: RapidMatch): SpecGroup[] {
  if (match.kind === "CAR") {
    const row = match.row as RapidCarRow;
    const powertrain = [
      { label: "Make / model", value: `${row.make ?? "—"} ${row.model ?? ""}`.trim() },
      { label: "Year (API row)", value: row.year != null ? String(row.year) : undefined },
      { label: "Body class", value: row.class },
      { label: "Fuel", value: fuelLabel(row.fuel_type) },
      { label: "Gearbox", value: gearboxLabel(row.transmission) },
      { label: "Drive", value: row.drive?.toUpperCase() },
      {
        label: "Displacement",
        value: litresToCc(row.displacement),
        plain: row.displacement != null ? `${row.displacement} litres` : undefined,
      },
      { label: "Cylinders", value: row.cylinders != null ? String(row.cylinders) : undefined },
    ].filter((item): item is { label: string; value: string; plain?: string } =>
      Boolean(item.value),
    );

    const economy = [
      {
        label: "City economy (EPA)",
        value: mpgToKmL(row.city_mpg),
        plain: "Converted from US miles-per-gallon. Not an Indian ARAI sticker.",
      },
      {
        label: "Highway economy (EPA)",
        value: mpgToKmL(row.highway_mpg),
      },
      {
        label: "Combined economy (EPA)",
        value: mpgToKmL(row.combination_mpg),
      },
    ].filter((item): item is { label: string; value: string; plain?: string } =>
      Boolean(item.value),
    );

    return [
      ...(powertrain.length ? [{ label: "API Ninjas — powertrain", items: powertrain }] : []),
      ...(economy.length ? [{ label: "API Ninjas — economy", items: economy }] : []),
    ];
  }

  const row = match.row as RapidBikeRow;
  const ride = [
    { label: "Make / model", value: `${row.make ?? "—"} ${row.model ?? ""}`.trim() },
    { label: "Year", value: row.year },
    { label: "Type", value: row.type },
    { label: "Engine", value: row.engine },
    { label: "Displacement", value: row.displacement },
    { label: "Power", value: row.power },
    { label: "Torque", value: row.torque },
    { label: "Gearbox", value: row.gearbox },
    { label: "Final drive", value: row.transmission },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  const chassis = [
    { label: "Seat height", value: row.seat_height },
    { label: "Kerb weight", value: row.total_weight },
    { label: "Length", value: row.total_length },
    { label: "Wheelbase", value: row.wheelbase },
    { label: "Ground clearance", value: row.ground_clearance },
    { label: "Fuel tank", value: row.fuel_capacity },
    { label: "Front brakes", value: row.front_brakes },
    { label: "Starter", value: row.starter },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return [
    ...(ride.length ? [{ label: "API Ninjas — engine & ride", items: ride }] : []),
    ...(chassis.length ? [{ label: "API Ninjas — chassis", items: chassis }] : []),
  ];
}
