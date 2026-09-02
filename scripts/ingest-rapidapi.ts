/**
 * Fetches API Ninjas technical rows for every catalogue vehicle and refreshes
 * photographs from Wikimedia Commons into `public/vehicles/`.
 * Does not write prices (those stay on our pricing engine).
 *
 *   npm run ingest:rapidapi
 */
import { spawn } from "node:child_process";
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });
config();

function refreshPhotos(): Promise<void> {
  return new Promise((done, fail) => {
    const child = spawn(process.execPath, ["scripts/fetch-car-photos.mjs"], {
      cwd: process.cwd(),
      stdio: "inherit",
    });
    child.on("error", fail);
    child.on("exit", (code) => {
      if (code === 0) done();
      else fail(new Error(`fetch:photos exited with code ${code}`));
    });
  });
}

async function main() {
  const { vehicles } = await import("../src/lib/catalogue/seedData");
  const { ingestVehicles } = await import("../src/lib/ingestion/syncCatalogue");
  const { probeRapidCars } = await import("../src/lib/providers/rapidapi");

  console.log("\nRefreshing vehicle photographs from Wikimedia Commons…");
  await refreshPhotos();

  const probe = await probeRapidCars();
  console.log(
    probe.ok
      ? `\nCars API reachable — sample row: ${probe.sample} (${probe.count} hits)`
      : `\nCars API probe returned no rows. Check RAPIDAPI_KEY and that you are subscribed to cars-by-api-ninjas.`,
  );

  const report = await ingestVehicles(vehicles);

  if (!report.rapidApiConfigured) {
    console.error(
      "RAPIDAPI_KEY is missing. Copy the RapidAPI block from .env.example into .env.local.",
    );
    process.exit(1);
  }

  console.log(`\nCarBikeKharido.com — RapidAPI ingestion`);
  console.log(`Fetched ${report.fetchedAt}`);
  console.log(`Vehicles: ${report.vehicles.length}\n`);

  for (const item of report.vehicles) {
    const spec = item.specs.source === "rapidapi" ? "hit" : "miss";
    const query = item.specs.query
      ? `${item.specs.query.make} / ${item.specs.query.model}`
      : "—";
    console.log(`• ${item.name} (${item.slug})`);
    console.log(`    specs  ${spec}  query=${query}`);
    if (item.specs.note) console.log(`    note   ${item.specs.note}`);
    if (item.specs.approximate) {
      console.log(`    warn   API nameplate is an approximate match`);
    }
    console.log(
      `    photos ${item.photos.count}  source=${item.photos.source}  ${item.photos.lead ?? ""}`,
    );
  }

  const hits = report.vehicles.filter((item) => item.specs.source === "rapidapi");
  console.log(`\n${hits.length}/${report.vehicles.length} nameplates matched on API Ninjas.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
