import { chromium } from 'playwright';
import fs from 'fs';

const TARGET_URL = 'https://car-bike-kharido1.vercel.app';

(async () => {
  console.log(`\n🔍 Starting Navigation & Sub-Menu Deep Scan: ${TARGET_URL}\n`);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

  const issues = [];
  const discoveredLinks = new Set();

  // 1. Locate all top navigation items / dropdown triggers (buttons or parent links)
  const navTriggers = await page.$$('nav button, nav [aria-haspopup="true"], header button, nav div[class*="dropdown"], nav li');
  console.log(`Found ${navTriggers.length} potential menu/trigger elements. Interacting to reveal sub-menus...`);

  for (const trigger of navTriggers) {
    try {
      // Hover and click to trigger hover menus or click-to-open submenus
      await trigger.hover({ timeout: 2000 }).catch(() => {});
      await trigger.click({ timeout: 1000 }).catch(() => {});
      await page.waitForTimeout(300); // Allow opening animation
    } catch {
      // Continue if element is a non-interactive container
    }
  }

  // 2. Extract every anchor href exposed in the DOM (including newly revealed submenus)
  const links = await page.$$eval('a', anchors =>
    anchors.map(a => ({
      text: a.innerText.trim().replace(/\n/g, ' '),
      href: a.getAttribute('href')
    }))
  );

  for (const item of links) {
    if (item.href && !item.href.startsWith('#') && !item.href.startsWith('mailto:') && !item.href.startsWith('tel:')) {
      try {
        const fullUrl = item.href.startsWith('http') ? item.href : new URL(item.href, TARGET_URL).toString();
        if (fullUrl.startsWith(TARGET_URL)) {
          discoveredLinks.add(JSON.stringify({ text: item.text || 'No text', url: fullUrl }));
        }
      } catch {}
    }
  }

  const uniqueLinks = Array.from(discoveredLinks).map(l => JSON.parse(l));
  console.log(`Discovered ${uniqueLinks.length} total links across navigation and sub-menus.\nTesting all routes...`);

  // 3. Verify each discovered link
  for (const linkObj of uniqueLinks) {
    try {
      const testPage = await browser.newPage();
      const res = await testPage.goto(linkObj.url, { waitUntil: 'domcontentloaded', timeout: 12000 });
      const status = res ? res.status() : 0;

      if (status >= 400 || status === 0) {
        issues.push(`[HTTP ${status}] Broken Menu Link: "${linkObj.text}" -> ${linkObj.url}`);
        console.log(`  ❌ [${status}] "${linkObj.text}" -> ${linkObj.url}`);
      } else {
        console.log(`  ✓ [${status}] "${linkObj.text}"`);
      }
      await testPage.close();
    } catch (err) {
      issues.push(`[Failed Request] Menu Item: "${linkObj.text}" -> ${linkObj.url} (${err.message})`);
      console.log(`  ❌ [Failed] "${linkObj.text}"`);
    }
  }

  await browser.close();

  // 4. Save results to file
  const report = issues.length > 0
    ? `=== BROKEN MENU ITEMS FOUND (${issues.length}) ===\n${issues.join('\n')}`
    : `=== ALL MENU ITEMS PASSED ===\nAll ${uniqueLinks.length} discovered header and sub-menu links returned 200 OK.`;

  fs.writeFileSync('menu_audit_results.txt', report);
  console.log(`\nScan complete. Results written to menu_audit_results.txt`);
})();