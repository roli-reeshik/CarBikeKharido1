import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import sharp from 'sharp';
import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ Error: DATABASE_URL not found in .env file.');
  process.exit(1);
}

// Initialize Prisma 7 PostgreSQL Driver Adapter
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'vehicles');

const VEHICLE_CATALOG_IMAGES = [
  {
    slug: 'hyundai-creta',
    category: 'HERO',
    filename: 'hyundai-creta-hero.webp',
    sourceUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80'
  },
  {
    slug: 'mahindra-xuv-3xo',
    category: 'HERO',
    filename: 'mahindra-xuv-3xo-1.webp',
    sourceUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=80'
  },
  {
    slug: 'mahindra-thar',
    category: 'HERO',
    filename: 'mahindra-thar-1.webp',
    sourceUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=80'
  },
  {
    slug: 'tata-punch-ev',
    category: 'HERO',
    filename: 'tata-punch-ev-1.webp',
    sourceUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=80'
  },
  {
    slug: 'maruti-ertiga',
    category: 'HERO',
    filename: 'maruti-ertiga-1.webp',
    sourceUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80'
  },
  {
    slug: 'royal-enfield-classic-350',
    category: 'HERO',
    filename: 'royal-enfield-classic-350-1.webp',
    sourceUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1600&q=80'
  },
  {
    slug: 'tvs-iqube',
    category: 'HERO',
    filename: 'tvs-iqube-1.webp',
    sourceUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1600&q=80'
  },
  {
    slug: 'ola-s1',
    category: 'HERO',
    filename: 'ola-s1-1.webp',
    sourceUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1600&q=80'
  },
  {
    slug: 'ducati-panigale-v4',
    category: 'HERO',
    filename: 'ducati-panigale-v4-1.webp',
    sourceUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1600&q=80'
  }
];

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  console.log('🚀 Starting local vehicle media download & DB sync...\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created local media directory: ${OUTPUT_DIR}`);
  }

  for (const item of VEHICLE_CATALOG_IMAGES) {
    const targetFilePath = path.join(OUTPUT_DIR, item.filename);
    const localDbPath = `/vehicles/${item.filename}`;

    try {
      console.log(`Processing: ${item.slug}...`);
      const rawBuffer = await downloadBuffer(item.sourceUrl);

      // Convert & optimize to WebP locally
      await sharp(rawBuffer)
        .resize(1600, 900, { fit: 'cover', position: 'center' })
        .webp({ quality: 80 })
        .toFile(targetFilePath);

      console.log(`  ✓ Image saved locally: ${targetFilePath}`);

      // Link to Database
      const vehicle = await prisma.vehicle.findUnique({
        where: { slug: item.slug }
      });

      if (vehicle) {
        // Clear old media entries for this category if any
        await prisma.localMedia.deleteMany({
          where: { vehicleId: vehicle.id, category: item.category }
        });

        await prisma.localMedia.create({
          data: {
            vehicleId: vehicle.id,
            localPath: localDbPath,
            category: item.category,
            isHero: item.category === 'HERO'
          }
        });
        console.log(`  ✓ Synced in database for ${vehicle.name}`);
      } else {
        console.log(`  ℹ Vehicle "${item.slug}" not in DB yet (saved locally for future seed).`);
      }

    } catch (err) {
      console.error(`  ❌ Error on ${item.slug}:`, err.message);
    }
  }

  await prisma.$disconnect();
  await pool.end();
  console.log('\n✅ All images downloaded and database records updated successfully!');
}

run().catch(async (e) => {
  console.error('Fatal error:', e);
  await prisma.$disconnect();
  await pool.end();
  process.exit(1);
});