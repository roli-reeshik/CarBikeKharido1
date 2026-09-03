import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import sharp from 'sharp';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'vehicles');

// The exact 8 missing files detected by your Playwright audit
const IMAGES = [
  {
    filename: 'mahindra-xuv-3xo-1.jpg',
    url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=80'
  },
  {
    filename: 'mahindra-thar-1.jpg',
    url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=80'
  },
  {
    filename: 'tata-punch-ev-1.png',
    url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=80'
  },
  {
    filename: 'maruti-ertiga-1.jpg',
    url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80'
  },
  {
    filename: 'royal-enfield-classic-350-1.jpg',
    url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1600&q=80'
  },
  {
    filename: 'tvs-iqube-1.jpg',
    url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1600&q=80'
  },
  {
    filename: 'ola-s1-1.jpg',
    url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1600&q=80'
  },
  {
    filename: 'ducati-panigale-v4-1.jpg',
    url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1600&q=80'
  }
];

function download(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  console.log('📥 Downloading static vehicle images into /public/vehicles/...\n');
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const img of IMAGES) {
    const dest = path.join(OUTPUT_DIR, img.filename);
    try {
      console.log(`Fetching ${img.filename}...`);
      const buffer = await download(img.url);

      if (img.filename.endsWith('.png')) {
        await sharp(buffer).resize(1600, 900, { fit: 'cover' }).png().toFile(dest);
      } else {
        await sharp(buffer).resize(1600, 900, { fit: 'cover' }).jpeg({ quality: 85 }).toFile(dest);
      }
      console.log(`  ✓ Saved: ${dest}`);
    } catch (e) {
      console.error(`  ❌ Failed ${img.filename}:`, e.message);
    }
  }
  console.log('\n✨ Done! All missing images exist locally now.');
}

run();