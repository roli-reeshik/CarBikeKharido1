import { notFound, permanentRedirect } from "next/navigation";

import { getVehicleBySlug, getVehicles } from "@/lib/catalogue/repository";
import { vehiclePath } from "@/lib/routes";

/**
 * Canonical detail URLs are now `/cars/[slug]` and `/bikes/[slug]`.
 * This keeps older `/vehicles/...` links working with a 308.
 */
export async function generateStaticParams() {
  const vehicles = await getVehicles();
  return vehicles.map((vehicle) => ({ slug: vehicle.slug }));
}

export default async function LegacyVehiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();
  permanentRedirect(vehiclePath(vehicle));
}
