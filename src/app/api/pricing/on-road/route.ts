/**
 * Real-time on-road quote for CarBikeKharido.com.
 * © VidyaLabs. All Rights Reserved.
 * Principal Developer: Rajesh Kumar
 */
import { NextResponse } from "next/server";

import { statutoryAttribution } from "@/lib/attribution";
import {
  getPricingRules,
  getServiceCities,
  getVehicleBySlug,
} from "@/lib/catalogue/repository";
import { headlineVariant } from "@/lib/catalogue/types";
import { calculateOnRoadPrice } from "@/lib/pricingEngine";
import { siteConfig } from "@/lib/siteConfig";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug")?.trim();
  const variantId = url.searchParams.get("variantId")?.trim();
  const cityId = url.searchParams.get("cityId")?.trim() ?? "lucknow";

  if (!slug) {
    return NextResponse.json(
      {
        error: "Pass ?slug=hyundai-creta",
        attribution: statutoryAttribution(),
      },
      { status: 400 },
    );
  }

  const [vehicle, rules] = await Promise.all([
    getVehicleBySlug(slug),
    getPricingRules(),
  ]);
  if (!vehicle) {
    return NextResponse.json(
      { error: "Vehicle not found", attribution: statutoryAttribution() },
      { status: 404 },
    );
  }

  const cities = getServiceCities();
  const city =
    cities.find((item) => item.id === cityId) ??
    cities.find((item) => item.name.toLowerCase() === cityId.toLowerCase()) ??
    cities[0];
  const variant =
    vehicle.variants.find((item) => item.id === variantId) ??
    headlineVariant(vehicle);

  const quote = calculateOnRoadPrice(
    {
      exShowroomPaise: variant.exShowroomPricePence,
      vehicleType: vehicle.type,
      fuelType: variant.fuelType,
      engineCc: variant.engineCc,
      stateCode: city.stateCode,
      cityName: city.name,
    },
    rules,
  );

  return NextResponse.json({
    platform: siteConfig.name,
    vehicle: {
      slug: vehicle.slug,
      name: vehicle.name,
      brand: vehicle.brand,
      type: vehicle.type,
    },
    variant: { id: variant.id, name: variant.name },
    city: { id: city.id, name: city.name, stateCode: city.stateCode, rto: city.rto },
    quote,
    attribution: statutoryAttribution(),
  });
}
