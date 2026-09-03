/**
 * Downloads freely-licensed photographs of each car from Wikimedia Commons into
 * `public/cars/`, and writes the attribution manifest to
 * `src/lib/carPhotos.generated.ts`.
 *
 * This is the fallback image source used when no EVOX Images licence is
 * configured (see `src/lib/providers/images.ts`). Commons is used because every
 * file there carries a free licence; we record the author and licence for each
 * one so the UI can credit it.
 *
 * Usage: node scripts/fetch-car-photos.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UA =
  "CarBikeKharido/1.0 (https://carbikekharido.com; rkrajesh.pgi@gmail.com)";
const API = "https://commons.wikimedia.org/w/api.php";
const OUT_DIR = path.join(process.cwd(), "public", "vehicles");
const MANIFEST = path.join(
  process.cwd(),
  "src",
  "lib",
  "vehiclePhotos.generated.ts",
);
const TARGET_WIDTH = 1600;

/**
 * Per-car search plan. `queries` are tried in order; `require` tokens must all
 * appear in the file title (case-insensitive) for a candidate to be accepted,
 * which keeps out auto-show crowd shots and unrelated vehicles.
 */
const plans = [
  {
    id: "tata-nexon",
    queries: [
      "2023 Tata Nexon XZA",
      "Tata Nexon 2023 Rear View",
      "Tata Nexon Dual Tone",
      "Tata Nexon",
    ],
    // Our Nexon is the petrol compact SUV, so the Nexon EV is a different car.
    require: ["nexon"],
    prefer: ["2023", "2024", "2025", "xz", "dual tone"],
    avoid: ["nexon ev", "ev ", "2014", "2017", "2020", "salon", "genève", "geneva", "xuv"],
    pin: [
      "2023 Tata Nexon XZA+ front view.jpg",
      "Tata Nexon 2023 Rear View 2.jpg",
      "Tata Nexon Blue Dual Tone.jpg",
    ],
    want: 3,
  },
  {
    id: "maruti-fronx",
    queries: [
      "2025 Suzuki Fronx Hybrid front",
      "Suzuki Fronx 1.5 GL 2024",
      "2024 Suzuki Fronx rear",
      "Maruti Suzuki Fronx",
      "Suzuki Fronx India",
    ],
    require: ["fronx"],
    prefer: ["2025", "2024", "front", "india", "gl"],
    avoid: ["prototype", "concept", "interior", "cancun"],
    pin: [
      "2025 Suzuki Fronx Hybrid front.jpg",
      "Suzuki Fronx 1.5 GL 2024.jpg",
      "2023 Suzuki Fronx 1.2 Delta+ (India) front view.png",
    ],
    want: 3,
  },
  {
    id: "hyundai-creta",
    queries: [
      "2024 Hyundai Creta 1.5 MPi SX(O) India",
      "2024 Hyundai Creta N Line India",
      "2024 Hyundai Creta India",
      "Hyundai Creta India",
    ],
    require: ["creta"],
    prefer: ["2024", "2025", "india", "sx"],
    // Drop first-gen / export faces. N Line is still the 2024 India Creta.
    avoid: [
      "ix25",
      "2015",
      "2016",
      "2017",
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "solaris",
      "moscow",
      "indonesia",
      "engine",
    ],
    pin: [
      "2024 Hyundai Creta 1.5 MPi SX(O) (India) front view.png",
      "2024 Hyundai Creta N Line 1.5 T-GDi (India) front view.png",
    ],
    want: 3,
  },
  {
    id: "mahindra-xuv-3xo",
    queries: ["Mahindra XUV 3XO", "Mahindra XUV3XO"],
    // Must be "3xo" — plain "xuv" also matches the XUV400 and XUV700.
    require: ["3xo"],
    prefer: ["2024", "2025", "ax7", "india"],
    avoid: ["xuv400", "xuv 400", "xuv700", "xuv 700"],
    want: 3,
  },
  {
    id: "mahindra-thar",
    queries: ["Mahindra Thar ROXX", "Mahindra Thar 2024", "Mahindra Thar"],
    require: ["thar"],
    prefer: ["roxx", "2024", "2025", "dirt"],
    avoid: ["people of", "shri ajoba", "cropped"],
    pin: [
      "Mahindra Thar ROXX on dirt.jpg",
      "Mahindra Thar ROXX on rocks.jpg",
    ],
    want: 2,
  },
  {
    id: "tata-punch-ev",
    queries: ["Tata Punch EV", "Tata Punch.ev", "Tata Punch electric"],
    require: ["punch"],
    prefer: ["ev", "2024", "2025"],
    avoid: ["nexon", "harrier", "safari"],
    want: 3,
  },
  {
    id: "maruti-ertiga",
    queries: ["Maruti Suzuki Ertiga", "Suzuki Ertiga 2023", "Suzuki Ertiga India"],
    require: ["ertiga"],
    prefer: ["2023", "2024", "2025", "india"],
    avoid: ["xl6", "invicto", "rumion"],
    want: 3,
  },
  // --- Two-wheelers -------------------------------------------------------
  {
    id: "royal-enfield-classic-350",
    queries: [
      "Royal Enfield Classic 350 Gran Via",
      "Royal Enfield Classic Signals 350",
      "Royal Enfield Classic 350 2017 Model Year",
      "Royal Enfield Classic 350",
    ],
    require: ["classic"],
    prefer: ["350", "gran via", "signals", "2017 model year", "royal enfield"],
    // The Bullet and Meteor are different models; skip close-ups and vintage 350s.
    avoid: [
      "bullet",
      "meteor",
      "hunter",
      "interceptor",
      "500",
      "electra",
      "head light",
      "speedometer",
      "2010",
      "1969",
      "1970",
      "1975",
      "orcal",
    ],
    pin: [
      "Royal Enfield Classic 350 - Gran Via - Madrid 01.jpg",
      "Royal Enfield Classic Signals 350.jpg",
      "Royal Enfield Classic 350.jpg",
    ],
    want: 3,
  },
  {
    id: "tvs-iqube",
    queries: ["TVS iQube", "TVS scooter electric", "TVS Motor iQube"],
    // Commons spells it "Tvs i qube" with a space, so match on the distinctive
    // fragment rather than the marketing spelling.
    require: ["qube"],
    prefer: ["tvs", "electric", "2022", "2023", "2024"],
    avoid: ["concept", "m1-s"],
    want: 3,
  },
  {
    id: "ola-s1",
    queries: ["Ola S1 Pro", "Ola S1 Blue", "Ola Electric S1"],
    require: ["s1"],
    prefer: ["pro", "blue", "2024", "2025"],
    avoid: ["interior"],
    pin: ["Ola S1 Pro.jpg", "Ola S1 Blue.jpg"],
    want: 2,
  },
  {
    id: "ducati-panigale-v4",
    queries: [
      "Ducati Panigale V4 R",
      "Ducati Panigale V4S 2025",
      "Ducati Panigale V4 2026",
      "Ducati Panigale V4",
    ],
    require: ["panigale"],
    prefer: ["v4", "2025", "2026", "red"],
    avoid: ["superleggera", "bodensee"],
    pin: ["Ducati Panigale V4 R (3).jpg", "Ducati Panigale V4S 2025.jpg"],
    want: 2,
  },
];

const stripHtml = (value) =>
  String(value ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

async function search(query) {
  const url = `${API}?${new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: "12",
    prop: "imageinfo",
    iiprop: "url|extmetadata|size|mime",
    iiurlwidth: String(TARGET_WIDTH),
    format: "json",
    formatversion: "2",
  })}`;

  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Commons search failed: ${res.status}`);
  const json = await res.json();
  return json?.query?.pages ?? [];
}

function toCandidate(page) {
  const info = page.imageinfo?.[0];
  if (!info) return null;
  if (!/^image\/(jpeg|png|webp)$/.test(info.mime ?? "")) return null;
  if ((info.width ?? 0) < 800) return null;

  const meta = info.extmetadata ?? {};
  const licence = stripHtml(meta.LicenseShortName?.value) || "unknown";

  // Commons only hosts free licences, but be explicit and skip anything
  // flagged as non-free just in case.
  if (/fair use|non-free/i.test(licence)) return null;

  return {
    title: page.title,
    // The thumbnail URL is a normalised, resized derivative; drop tracking params.
    downloadUrl: (info.thumburl ?? info.url).split("?")[0],
    width: info.thumbwidth ?? info.width,
    height: info.thumbheight ?? info.height,
    licence,
    licenceUrl: stripHtml(meta.LicenseUrl?.value) || "",
    author: stripHtml(meta.Artist?.value) || "Unknown",
    descriptionUrl: info.descriptionurl ?? "",
  };
}

/**
 * Ranks candidates so the lead photo is a front three-quarter view of the
 * correct market's car, rather than a rear shot or a show-floor prototype.
 */
function score(candidate, plan) {
  // Search results arrive as "File:Name.jpg"; compare against the bare name.
  const title = candidate.title.replace(/^File:/i, "").toLowerCase();
  let value = 0;

  // Commons titles describe framing unreliably — a file called "SideView" can
  // be a fuel-tank close-up — so `pin` lets a reviewed file be forced to lead.
  // Earlier pins outrank later ones so the listed order is the gallery order.
  for (const [index, token] of (plan.pin ?? []).entries()) {
    if (title === token.toLowerCase()) value += 800 - index * 80;
  }

  // A wrong-model or wrong-generation photo is worse than a rear view, so the
  // per-plan penalty outweighs every framing bonus below.
  for (const token of plan.avoid ?? []) {
    if (title.includes(token)) value -= 150;
  }
  for (const token of plan.prefer ?? []) {
    if (title.includes(token)) value += 45;
  }

  if (/front/.test(title)) value += 100;
  else if (/side|profile/.test(title)) value += 60;
  else if (/rear|back/.test(title)) value += 10;
  else value += 40;

  if (/interior|dashboard|engine|boot|wheel|badge|logo/.test(title)) value -= 90;
  if (/concept|prototype/.test(title)) value -= 120;
  // Motor-show halls date the car and usually have crowds in frame.
  if (/salon|motor show|auto expo|geneva|genève|iaa/.test(title)) value -= 120;

  const aspect = candidate.width / candidate.height;
  if (aspect >= 1.3 && aspect <= 2.1) value += 20;
  else if (aspect < 1.1) value -= 15;

  return value;
}

async function download(url, destination) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(destination, buffer);
  return buffer.length;
}

await mkdir(OUT_DIR, { recursive: true });

const manifest = {};

for (const plan of plans) {
  const pool = [];
  const seenTitles = new Set();

  // Gather across every query first, then rank — otherwise query order alone
  // decides the lead photo.
  for (const query of plan.queries) {
    let pages = [];
    try {
      pages = await search(query);
    } catch (error) {
      console.log(`  ! search "${query}" failed: ${error.message}`);
      continue;
    }

    for (const page of pages) {
      if (seenTitles.has(page.title)) continue;

      const haystack = page.title.toLowerCase();
      if (!plan.require.every((token) => haystack.includes(token))) continue;

      const candidate = toCandidate(page);
      if (!candidate) continue;

      seenTitles.add(page.title);
      pool.push(candidate);
    }
  }

  pool.sort((a, b) => score(b, plan) - score(a, plan));
  const chosen = pool.slice(0, plan.want);

  console.log(`\n${plan.id}: ${chosen.length} of ${pool.length} candidate(s)`);

  const entries = [];
  for (const [index, candidate] of chosen.entries()) {
    const extension = candidate.downloadUrl.match(/\.(jpe?g|png|webp)$/i)?.[1] ?? "jpg";
    const filename = `${plan.id}-${index + 1}.${extension.toLowerCase()}`;
    const destination = path.join(OUT_DIR, filename);

    try {
      const bytes = await download(candidate.downloadUrl, destination);
      console.log(
        `  ok ${filename} (${Math.round(bytes / 1024)} KB, ${candidate.licence})`,
      );
      const cleanTitle = candidate.title.replace(/^File:/, "");
      const note = (plan.notes ?? []).find(([pattern]) =>
        pattern.test(cleanTitle),
      )?.[1];

      entries.push({
        src: `/vehicles/${filename}`,
        width: candidate.width,
        height: candidate.height,
        title: cleanTitle,
        author: candidate.author,
        licence: candidate.licence,
        licenceUrl: candidate.licenceUrl,
        sourceUrl: candidate.descriptionUrl,
        ...(note ? { note } : {}),
      });
    } catch (error) {
      console.log(`  ! ${filename}: ${error.message}`);
    }
  }

  manifest[plan.id] = entries;
}

const header = `// AUTO-GENERATED by scripts/fetch-car-photos.mjs — do not edit by hand.
// Photographs come from Wikimedia Commons under the licence recorded on each
// entry. Re-run the script to refresh. Credit is rendered by PhotoCredit.tsx.

import type { CarPhoto } from "./types";

export const carPhotos: Record<string, CarPhoto[]> = ${JSON.stringify(
  manifest,
  null,
  2,
)};
`;

await writeFile(MANIFEST, header, "utf8");
console.log(`\nWrote ${MANIFEST}`);
