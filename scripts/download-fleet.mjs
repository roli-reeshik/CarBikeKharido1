import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'vehicles');

const EXPANDED_FLEET = [
  // Popular Cars
  { name: 'tata-harrier-1.webp', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80' },
  { name: 'kia-seltos-1.webp', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80' },
  { name: 'maruti-brezza-1.webp', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80' },
  { name: 'honda-city-1.webp', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80' },
  { name: 'toyota-fortuner-1.webp', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=80' },
  { name: 'hyundai-verna-1.webp', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=80' },
  { name: 'maruti-baleno-1.webp', url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1600&q=80' },

  // Popular Two-Wheelers
  { name: 'yamaha-r15-1.webp', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1600&q=80' },
  { name: 'ktm-duke-390-1.webp', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1600&q=80' },
  { name: 'hero-splendor-1.webp', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1600&q=80' },
  { name: 'bajaj-pulsar-1.webp', url: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1600&q=80' },
  { name: 'honda-activa-6g-1.webp', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1600&q=80' },
  { name: 'ather-450x-1.webp', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1600&q=80' },
  { name: 'suzuki-hayabusa-1.webp', url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1600&q=80' }
];

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`Status ${res.statusCode}`));
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Downloading ${EXPANDED_FLEET.length} vehicles into /public/vehicles/...\n`);

  for (const item of EXPANDED_FLEET) {
    const dest = path.join(OUTPUT_DIR, item.name);
    try {
      console.log(`Fetching ${item.name}...`);
      const buffer = await download(item.url);
      await sharp(buffer)
        .resize(1600, 900, { fit: 'cover', position: 'center' })
        .webp({ quality: 82 })
        .toFile(dest);
      console.log(`  ✓ Saved: ${dest}`);
    } catch (e) {
      console.error(`  ❌ Failed ${item.name}:`, e.message);
    }
  }
  console.log('\nAll fleet images downloaded and optimized successfully.');
}

run();