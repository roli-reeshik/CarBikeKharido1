/**
 * Dynamic vehicle payload for CarBikeKharido.com.
 * © VidyaLabs. All Rights Reserved.
 * Principal Developer: Rajesh Kumar
 */
import { NextResponse } from "next/server";

import { statutoryAttribution } from "@/lib/attribution";
import { getVehicleBySlug } from "@/lib/catalogue/repository";
import { vehiclePath } from "@/lib/routes";
import { siteConfig } from "@/lib/siteConfig";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) {
    return NextResponse.json(
      { error: "Vehicle not found", attribution: statutoryAttribution() },
      { status: 404 },
    );
  }

  return NextResponse.json({
    platform: siteConfig.name,
    canonicalPath: vehiclePath(vehicle),
    vehicle,
    attribution: statutoryAttribution(),
  });
}
