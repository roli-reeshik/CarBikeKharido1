/**
 * EVOX Images adapter — studio photography by year / make / model.
 *
 * IMPORTANT COVERAGE CAVEAT: the EVOX library covers North American consumer
 * vehicles from model year 2000 onward. Most Indian-market cars (Nexon, Fronx,
 * XUV 3XO, Punch, Ertiga) are not sold in North America and therefore have no
 * EVOX assets. This adapter is wired up so that it is used automatically for
 * any model EVOX does carry, and returns an empty list otherwise, letting the
 * resolver fall through to the Wikimedia Commons photographs in `public/cars/`.
 *
 * Access requires a licence (licensing@evox.com) or a reseller account such as
 * One Auto API or Fuel API. Set EVOX_API_KEY to enable.
 */
import type { CarPhoto } from "../types";
import { authHeaders, evoxConfig, isEvoxEnabled } from "./config";
import { fetchJson, pick } from "./http";

export interface EvoxQuery {
  year: number;
  make: string;
  model: string;
}

interface EvoxAssetPayload {
  url?: string;
  imageUrl?: string;
  shotCode?: string;
  shot_code?: string;
  width?: number;
  height?: number;
  colorName?: string;
  color_name?: string;
}

interface EvoxResponsePayload {
  data?: EvoxAssetPayload[];
  assets?: EvoxAssetPayload[];
  images?: EvoxAssetPayload[];
}

/**
 * Fetches licensed stills for one vehicle. Returns `[]` when no key is
 * configured or the model is outside EVOX's coverage.
 */
export async function fetchEvoxPhotos(query: EvoxQuery): Promise<CarPhoto[]> {
  if (!isEvoxEnabled()) return [];

  const url = `${evoxConfig.baseUrl}/vehicles?${new URLSearchParams({
    year: String(query.year),
    make: query.make,
    model: query.model,
    productId: evoxConfig.productId,
  })}`;

  const payload = await fetchJson<EvoxResponsePayload>(url, {
    headers: authHeaders(evoxConfig),
    // Studio assets change only when a new model year is shot.
    revalidate: 60 * 60 * 24,
  });

  const assets = payload?.data ?? payload?.assets ?? payload?.images;
  if (!Array.isArray(assets) || assets.length === 0) return [];

  return assets.flatMap((asset) => {
    const record = asset as unknown as Record<string, unknown>;
    const src = pick<string>(record, ["url", "imageUrl"]);
    if (!src) return [];

    const shot = pick<string>(record, ["shotCode", "shot_code"]) ?? "still";
    const colour = pick<string>(record, ["colorName", "color_name"]);

    return [
      {
        src,
        width: pick<number>(record, ["width"]) ?? 1600,
        height: pick<number>(record, ["height"]) ?? 1067,
        title: [query.year, query.make, query.model, colour, shot]
          .filter(Boolean)
          .join(" "),
        author: "EVOX Images",
        // EVOX assets are licensed, not open — credit accordingly.
        licence: "Licensed (EVOX Images)",
        licenceUrl: "https://evoximages.com/",
        sourceUrl: "https://evoximages.com/",
      } satisfies CarPhoto,
    ];
  });
}
