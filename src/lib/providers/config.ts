/**
 * Credentials and endpoint configuration for the external data providers.
 *
 * Both MyNewCar and EVOX Images are commercial, contract-gated services with no
 * public endpoint documentation, so every part of the request — base URL, path,
 * and auth header — is configurable rather than hard-coded. The defaults below
 * are best-effort starting points; confirm them against the contract pack you
 * receive from the vendor and override via environment variables as needed.
 *
 * Nothing here runs in the browser: these values are read only from server
 * components and route handlers, so the keys stay server-side.
 */

const read = (key: string) => process.env[key]?.trim() || undefined;

export const mynewcarConfig = {
  apiKey: read("MYNEWCAR_API_KEY"),
  baseUrl: read("MYNEWCAR_API_BASE_URL") ?? "https://api.mynewcar.in/v1",
  /** Header the key is sent in. Some plans issue `Authorization: Bearer …`. */
  authHeader: read("MYNEWCAR_AUTH_HEADER") ?? "x-api-key",
  authPrefix: read("MYNEWCAR_AUTH_PREFIX") ?? "",
  specsPath: read("MYNEWCAR_SPECS_PATH") ?? "/car-specs",
  pricePath: read("MYNEWCAR_PRICE_PATH") ?? "/car-price",
} as const;

export const rapidapiConfig = {
  apiKey: read("RAPIDAPI_KEY"),
  carsHost: read("RAPIDAPI_CARS_HOST") ?? "cars-by-api-ninjas.p.rapidapi.com",
  bikesHost:
    read("RAPIDAPI_BIKES_HOST") ?? "motorcycles-by-api-ninjas.p.rapidapi.com",
  appUrl: read("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000",
} as const;

export const evoxConfig = {
  apiKey: read("EVOX_API_KEY"),
  baseUrl: read("EVOX_API_BASE_URL") ?? "https://api.evoximages.com/api/v1",
  authHeader: read("EVOX_AUTH_HEADER") ?? "Authorization",
  authPrefix: read("EVOX_AUTH_PREFIX") ?? "Bearer ",
  /**
   * EVOX product code for the still-image set. 1 is the standard white
   * background front-three-quarter set on most contracts.
   */
  productId: read("EVOX_PRODUCT_ID") ?? "1",
} as const;

export const isMynewcarEnabled = () => Boolean(mynewcarConfig.apiKey);
export const isRapidApiEnabled = () => Boolean(rapidapiConfig.apiKey);
export const isEvoxEnabled = () => Boolean(evoxConfig.apiKey);

/** Builds the auth header pair for a provider, or `{}` when unconfigured. */
export function authHeaders(config: {
  apiKey?: string;
  authHeader: string;
  authPrefix: string;
}): Record<string, string> {
  if (!config.apiKey) return {};
  return { [config.authHeader]: `${config.authPrefix}${config.apiKey}` };
}
