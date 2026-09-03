/**
 * Local asset storage pipeline for CarBikeKharido.com.
 * © VidyaLabs. All Rights Reserved.
 * Principal Developer: Rajesh Kumar · +91 9140878191 · rkrajesh.pgi@gmail.com
 *
 * Photographs we host live under `public/uploads/vehicles/{slug}/` (operator
 * uploads) or `public/vehicles/` (curated Commons kit). The database stores
 * only the public path — never a remote OEM URL — so a CDN outage cannot blank
 * the VDP gallery.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { LocalMedia, MediaCategory, VehicleWithRelations } from "@/lib/catalogue/types";

export const LOCAL_UPLOAD_PREFIX = "/uploads/vehicles";
export const CURATED_VEHICLE_PREFIX = "/vehicles";

const PUBLIC_ROOT = path.join(process.cwd(), "public");

export function isLocalAssetPath(src: string): boolean {
  return (
    src.startsWith(LOCAL_UPLOAD_PREFIX) ||
    src.startsWith(`${CURATED_VEHICLE_PREFIX}/`)
  );
}

export function publicFilePath(publicPath: string): string {
  const relative = publicPath.replace(/^\/+/, "");
  return path.join(PUBLIC_ROOT, relative);
}

export function uploadPublicPath(
  slug: string,
  fileName: string,
): string {
  const safeSlug = slug.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const safeName = fileName.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
  return `${LOCAL_UPLOAD_PREFIX}/${safeSlug}/${safeName}`;
}

export async function writeLocalVehicleFile(
  slug: string,
  fileName: string,
  bytes: Buffer,
): Promise<string> {
  const publicPath = uploadPublicPath(slug, fileName);
  const diskPath = publicFilePath(publicPath);
  await mkdir(path.dirname(diskPath), { recursive: true });
  await writeFile(diskPath, bytes);
  return publicPath;
}

export function heroLocalPath(vehicle: VehicleWithRelations): string | null {
  const hero =
    vehicle.localMedia.find((item) => item.isHero) ?? vehicle.localMedia[0];
  return hero?.localPath ?? vehicle.images[0]?.url ?? null;
}

export function mediaByCategory(
  vehicle: VehicleWithRelations,
  category: MediaCategory,
): LocalMedia[] {
  return vehicle.localMedia.filter((item) => item.category === category);
}

export function attributionFooter(): string {
  return [
    "CarBikeKharido.com",
    "© VidyaLabs. All Rights Reserved.",
    "Principal Developer: Rajesh Kumar",
    "+91 9140878191 · rkrajesh.pgi@gmail.com",
    "C725, Kalpana Residency, Phase-II, Hulaskhera, Raebareli Road, Mohanlalganj, Lucknow, Uttar Pradesh - 226301",
  ].join(" · ");
}
