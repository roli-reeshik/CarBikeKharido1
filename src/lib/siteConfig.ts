/**
 * Single source of truth for platform identity and statutory contact details.
 *
 * Everything the header, metadata and footer display comes from here so the
 * name, ownership and address can never drift between pages.
 */

export const siteConfig = {
  name: "CarBikeKharido.com",
  /** Split for the two-tone wordmark in the header and footer. */
  wordmark: { lead: "CarBike", accent: "Kharido", suffix: ".com" },
  tagline: "Cars and bikes, explained in plain English",
  description:
    "Compare cars and bikes in India without the jargon. Real-world running costs, luggage measured in suitcases, and a transparent on-road price for your own city.",
  url: "https://carbikekharido.com",

  owner: "VidyaLabs",
  copyright: "© VidyaLabs. All Rights Reserved.",

  developer: {
    name: "Rajesh Kumar",
    role: "Principal Developer",
  },

  contact: {
    mobile: "+91 9140878191",
    /** E.164, for tel: links. */
    mobileHref: "tel:+919140878191",
    email: "rkrajesh.pgi@gmail.com",
    emailHref: "mailto:rkrajesh.pgi@gmail.com",
  },

  address: {
    lines: [
      "C725, Kalpana Residency, Phase-II",
      "Hulaskhera, Raebareli Road",
      "Mohanlalganj",
    ],
    city: "Lucknow",
    state: "Uttar Pradesh",
    postalCode: "226301",
    country: "India",
    /** Single-line form for metadata and structured data. */
    full: "C725, Kalpana Residency, Phase-II, Hulaskhera, Raebareli Road, Mohanlalganj, Lucknow, Uttar Pradesh - 226301",
  },
} as const;

/** schema.org LocalBusiness payload for the site's structured data block. */
export function buildOrganisationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    parentOrganization: { "@type": "Organization", name: siteConfig.owner },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.mobile,
      email: siteConfig.contact.email,
      contactType: "customer support",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.lines.join(", "),
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.postalCode,
      addressCountry: "IN",
    },
  };
}
