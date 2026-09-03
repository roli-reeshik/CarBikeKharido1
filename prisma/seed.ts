/**
 * Seeds PostgreSQL from the canonical dataset in `src/lib/catalogue/seedData.ts`.
 * CarBikeKharido.com · © VidyaLabs. All Rights Reserved.
 * Principal Developer: Rajesh Kumar
 *
 * Idempotent: every write is an upsert keyed on a stable id, so running it
 * repeatedly converges on the same state rather than duplicating rows. That
 * matters because this doubles as the "reset my local data" command.
 *
 *   npm run db:seed
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

import {
  insuranceRules,
  rtoTaxRates,
  rtoTaxRules,
  vehicles,
} from "../src/lib/catalogue/seedData";
import { toCarPhotos } from "../src/utils/getVehicleImage";
import { getReviewSections } from "../src/lib/vdpContent";

const connectionString = process.env.DATABASE_URL?.trim();
if (!connectionString) {
  console.error(
    "DATABASE_URL is not set. Copy .env.example to .env and point it at PostgreSQL:",
  );
  console.error(
    '  DATABASE_URL="postgresql://postgres:password@localhost:5432/carbikekharido?schema=public"',
  );
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  console.log("Seeding CarBikeKharido.com catalogue…");
  console.log("© VidyaLabs. All Rights Reserved. · Rajesh Kumar");

  for (const vehicle of vehicles) {
    const {
      variants,
      colors,
      localMedia,
      reviewSections: _seedReviews,
      images: _images,
      ...fields
    } = vehicle;

    await prisma.vehicle.upsert({
      where: { id: vehicle.id },
      create: fields,
      update: fields,
    });

    for (const variant of variants) {
      const data = {
        ...variant,
        exShowroomPricePence: BigInt(variant.exShowroomPricePence),
      };
      await prisma.variant.upsert({
        where: { id: variant.id },
        create: data,
        update: data,
      });
    }

    for (const color of colors) {
      const { imaginStudioColorCode: _alias, ...colorFields } = color;
      await prisma.vehicleColor.upsert({
        where: { id: color.id },
        create: colorFields,
        update: colorFields,
      });
    }

    for (const media of localMedia) {
      await prisma.localMedia.upsert({
        where: { id: media.id },
        create: media,
        update: media,
      });
    }

    const photos = toCarPhotos(vehicle.slug);
    const reviews = getReviewSections(vehicle, photos);
    for (const section of reviews) {
      const data = {
        id: `rev-${vehicle.slug}-${section.id}`,
        vehicleId: vehicle.id,
        sectionKey: section.id,
        title: section.heading,
        shortSummary: section.shortDescription,
        fullReview: section.fullDescription,
        imagePath: section.imageUrl ?? null,
      };
      await prisma.vehicleReview.upsert({
        where: { id: data.id },
        create: data,
        update: data,
      });
    }

    console.log(
      `  ${vehicle.name} — ${variants.length} variants, ${colors.length} colours, ${localMedia.length} local files, ${reviews.length} reviews`,
    );
  }

  for (const rule of rtoTaxRules) {
    const data = {
      ...rule,
      priceMin: BigInt(rule.priceMin),
      priceMax: BigInt(rule.priceMax),
      fixedFee: BigInt(rule.fixedFee),
    };
    await prisma.rtoTaxRule.upsert({
      where: { id: rule.id },
      create: data,
      update: data,
    });
  }
  console.log(`  ${rtoTaxRules.length} road tax bands`);

  for (const rate of rtoTaxRates) {
    await prisma.rtoTaxRate.upsert({
      where: { id: rate.id },
      create: rate,
      update: rate,
    });
  }
  console.log(`  ${rtoTaxRates.length} city tax rates`);

  for (const rule of insuranceRules) {
    const data = {
      ...rule,
      baseThirdParty1Yr: BigInt(rule.baseThirdParty1Yr),
      mandatoryCpaFee: BigInt(rule.mandatoryCpaFee),
    };
    await prisma.insuranceRule.upsert({
      where: { id: rule.id },
      create: data,
      update: data,
    });
  }
  console.log(`  ${insuranceRules.length} insurance bands`);

  console.log("Done. CarBikeKharido.com catalogue is live on PostgreSQL.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
