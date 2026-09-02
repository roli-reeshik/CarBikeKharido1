/**
 * Lets the split hero ask the catalogue section to switch lens
 * (cars vs bikes) after a smooth scroll.
 */
export const CATALOG_LENS_EVENT = "cbk:catalog-lens";

export function requestCatalogLens(lensId: string): void {
  window.dispatchEvent(new CustomEvent(CATALOG_LENS_EVENT, { detail: lensId }));
}
