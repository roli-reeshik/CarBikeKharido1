/**
 * Pulls RapidAPI technical rows and resolved photography for every catalogue
 * vehicle. Used by the CLI and by POST /api/ingestion/sync.
 *
 * Specs are not written to PostgreSQL — there is no specs table. They are
 * cached by Next.js fetch and merged onto the VDP at request time.
 */
import type { VehicleWithRelations } from "@/lib/catalogue/types";
import { resolveVehicleMedia } from "@/lib/ingestion/imageResolver";
import {
  fetchRapidSpecs,
  specsFromRapidMatch,
  type RapidMatch,
} from "@/lib/providers/rapidapi";
import { isRapidApiEnabled } from "@/lib/providers/config";
import type { DataSource, SpecGroup } from "@/lib/types";

export interface IngestionVehicleReport {
  slug: string;
  name: string;
  type: string;
  specs: {
    source: DataSource;
    query?: { make: string; model: string };
    approximate?: boolean;
    groups: SpecGroup[];
    note?: string;
  };
  photos: {
    source: DataSource;
    count: number;
    lead?: string;
  };
}

export interface IngestionReport {
  ok: boolean;
  rapidApiConfigured: boolean;
  fetchedAt: string;
  vehicles: IngestionVehicleReport[];
}

function describeMatch(match: RapidMatch | null): IngestionVehicleReport["specs"] {
  if (!match) {
    return {
      source: "sample",
      groups: [],
      note: isRapidApiEnabled()
        ? "API Ninjas returned no row for this nameplate. Editorial specs stay in place."
        : "RAPIDAPI_KEY is not set.",
    };
  }

  return {
    source: "rapidapi",
    query: match.query,
    approximate: match.approximate,
    groups: specsFromRapidMatch(match),
  };
}

export async function ingestVehicles(
  vehicles: VehicleWithRelations[],
): Promise<IngestionReport> {
  const rows: IngestionVehicleReport[] = [];
  for (const vehicle of vehicles) {
    const [match, media] = await Promise.all([
      fetchRapidSpecs(vehicle),
      resolveVehicleMedia(vehicle),
    ]);
    rows.push({
      slug: vehicle.slug,
      name: vehicle.name,
      type: vehicle.type,
      specs: describeMatch(match),
      photos: {
        source: media.source,
        count: media.photos.length,
        lead: media.photos[0]?.src,
      },
    });
  }

  return {
    ok: true,
    rapidApiConfigured: isRapidApiEnabled(),
    fetchedAt: new Date().toISOString(),
    vehicles: rows,
  };
}
