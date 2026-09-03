/**
 * Statutory attribution for CarBikeKharido.com API payloads and generated files.
 * © VidyaLabs. All Rights Reserved.
 */
import { siteConfig } from "@/lib/siteConfig";

export function statutoryAttribution() {
  return {
    platform: siteConfig.name,
    copyright: siteConfig.copyright,
    owner: siteConfig.owner,
    principalDeveloper: siteConfig.developer.name,
    contactMobile: siteConfig.contact.mobile,
    contactEmail: siteConfig.contact.email,
    registeredAddress: siteConfig.address.full,
  } as const;
}
