/**
 * Seeds PostgreSQL from the canonical dataset in `src/lib/catalogue/seedData.ts`.
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
  rtoTaxRules,
  vehicles,
} from "../src/lib/catalogue/seedData";

const connectionString = process.env.DATABASE_URL?.trim();
if (!connectionString) {
  console.error(
    "DATABASE_URL is not set. Copy .env.example to .env and point it at a PostgreSQL instance.",
  );
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  console.log("Seeding CarBikeKharido.com catalogue…");

  for (const vehicle of vehicles) {
    const { variants, colors, images, ...fields } = vehicle;

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
      await prisma.color.upsert({
        where: { id: color.id },
        create: color,
        update: color,
      });
    }

    for (const image of images) {
      await prisma.vehicleImage.upsert({
        where: { id: image.id },
        create: image,
        update: image,
      });
    }

    console.log(`  ${vehicle.name} — ${variants.length} variants, ${colors.length} colours`);
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

  console.log("Done.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
