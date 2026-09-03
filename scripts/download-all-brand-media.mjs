import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import sharp from 'sharp';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'vehicles');

// Full catalog covering all brands and body styles
const FLEET_ASSETS = [
  // --- HYUNDAI ---
  { filename: 'hyundai-alcazar.webp', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'hyundai-creta.webp', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'hyundai-verna.webp', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'hyundai-aura.webp', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'hyundai-i20.webp', url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'hyundai-grand-i10-nios.webp', url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'hyundai-exter.webp', url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'hyundai-ioniq-5.webp', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'hyundai-prime-hb.webp', url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80' },

  // --- TATA MOTORS ---
  { filename: 'tata-nexon.webp', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'tata-punch.webp', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'tata-punch-ev.webp', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'tata-harrier.webp', url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'tata-safari.webp', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'tata-curvv.webp', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'tata-tiago.webp', url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'tata-tigor.webp', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=80' },

  // --- MARUTI SUZUKI ---
  { filename: 'maruti-swift.webp', url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'maruti-brezza.webp', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'maruti-ertiga.webp', url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'maruti-grand-vitara.webp', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'maruti-dzire.webp', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'maruti-fronx.webp', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=80' },

  // --- MAHINDRA ---
  { filename: 'mahindra-thar.webp', url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'mahindra-scorpio-n.webp', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'mahindra-xuv-3xo.webp', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'mahindra-xuv700.webp', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80' },

  // --- BIKES & TWO-WHEELERS ---
  { filename: 'royal-enfield-classic-350.webp', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'royal-enfield-hunter-350.webp', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'tvs-iqube.webp', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'tvs-apache-rtr.webp', url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'ola-s1.webp', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1600&q=80' },
  { filename: 'ducati-panigale-v4.webp', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1600&q=80' }
];

function download(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`Status ${res.statusCode}`));
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`📥 Downloading ${FLEET_ASSETS.length} vehicle models into /public/vehicles/...\n`);

  for (const item of FLEET_ASSETS) {
    const dest = path.join(OUTPUT_DIR, item.filename);
    try {
      console.log(`Fetching: ${item.filename}...`);
      const buffer = await download(item.url);
      await sharp(buffer)
        .resize(1600, 900, { fit: 'cover', position: 'center' })
        .webp({ quality: 82 })
        .toFile(dest);
      console.log(`  ✓ Saved: ${dest}`);
    } catch (err) {
      console.error(`  ❌ Failed ${item.filename}:`, err.message);
    }
  }

  console.log('\n✅ All brand & category images downloaded successfully!');
}

run();