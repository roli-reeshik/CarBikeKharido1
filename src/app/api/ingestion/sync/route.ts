import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { getVehicles } from "@/lib/catalogue/repository";
import { ingestVehicles } from "@/lib/ingestion/syncCatalogue";

function authorised(request: Request): boolean {
  const secret =
    process.env.INGESTION_SECRET?.trim() || process.env.RAPIDAPI_KEY?.trim();
  if (!secret) return process.env.NODE_ENV !== "production";

  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : header;
  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Manual trigger: `POST /api/ingestion/sync`
 * Header: `Authorization: Bearer <INGESTION_SECRET or RAPIDAPI_KEY>`
 */
export async function POST(request: Request) {
  if (!authorised(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorised" }, { status: 401 });
  }

  const report = await ingestVehicles(await getVehicles());
  return NextResponse.json(report);
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    rapidApiConfigured: Boolean(process.env.RAPIDAPI_KEY?.trim()),
    carsHost: process.env.RAPIDAPI_CARS_HOST ?? "cars-by-api-ninjas.p.rapidapi.com",
    bikesHost:
      process.env.RAPIDAPI_BIKES_HOST ??
      "motorcycles-by-api-ninjas.p.rapidapi.com",
  });
}
