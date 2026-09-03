import { chromium } from 'playwright';
import fs from 'fs';

const TARGET_URL = 'https://car-bike-kharido1.vercel.app';

(async () => {
  console.log(`\n🔍 Starting smoke test on: ${TARGET_URL}`);
  console.log(`Using browser: Microsoft Edge (msedge)\n`);

  // Launch installed Microsoft Edge
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const report = {
    target: TARGET_URL,
    timestamp: new Date().toISOString(),
    consoleErrors: [],
    failedRequests: [],
    brokenLinks: [],
    missingImages: [],
    unclickableButtons: []
  };

  // 1. Capture Client-Side JavaScript Runtime Errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore external Vercel toolbar/telemetry noise
      if (!text.includes('vercel.com/api') && !text.includes('favicon')) {
        report.consoleErrors.push(text);
      }
    }
  });

  page.on('pageerror', error => {
    report.consoleErrors.push(`[Unhandled Crash] ${error.message}`);
  });

  // 2. Capture Failed Network Requests (404s, 500s) on actual site assets
  page.on('response', response => {
    const status = response.status();
    const url = response.url();
    if (status >= 400 && !url.includes('vercel.com/api')) {
      report.failedRequests.push({ status, url });
    }
  });

  try {
    // Navigate to homepage
    const response = await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });
    console.log(`Homepage HTTP Status: ${response.status()}`);

    // 3. Inspect All Images for broken sources or 0px render dimensions
    const images = await page.$$eval('img', imgs =>
      imgs.map(img => ({
        src: img.src,
        alt: img.alt || 'NO_ALT',
        isBroken: img.naturalWidth === 0
      }))
    );
    report.missingImages = images.filter(img => img.isBroken);

    // 4. Extract and Validate All Internal Links (Handles both relative and absolute paths)
    const rawHrefs = await page.$$eval('a', anchors =>
      anchors
        .map(a => a.getAttribute('href'))
        .filter(href => href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:'))
    );

    const internalLinks = [...new Set(
      rawHrefs.map(href => {
        try {
          if (href.startsWith('http')) return href;
          return new URL(href, TARGET_URL).toString();
        } catch {
          return null;
        }
      }).filter(url => url && url.startsWith(TARGET_URL))
    )];

    console.log(`Discovered ${internalLinks.length} internal routes to test...`);

    for (const link of internalLinks) {
      try {
        const checkPage = await context.newPage();
        const linkRes = await checkPage.goto(link, { waitUntil: 'domcontentloaded', timeout: 15000 });
        if (!linkRes || linkRes.status() >= 400) {
          report.brokenLinks.push({ url: link, status: linkRes ? linkRes.status() : 'TIMEOUT' });
        } else {
          console.log(`  ✓ [${linkRes.status()}] ${link}`);
        }
        await checkPage.close();
      } catch (err) {
        report.brokenLinks.push({ url: link, error: err.message });
      }
    }

    // 5. Test Key Buttons (Find disabled controls)
    const buttons = await page.$$eval('button', btns =>
      btns.map(b => ({
        text: b.innerText.trim(),
        disabled: b.disabled,
        ariaLabel: b.getAttribute('aria-label')
      }))
    );
    report.unclickableButtons = buttons.filter(b => b.disabled);

  } catch (err) {
    report.consoleErrors.push(`[Fatal Test Failure] ${err.message}`);
  } finally {
    await browser.close();
  }

  // Format Diagnostic Summary
  const summaryOutput = `
=== SMOKE AUDIT REPORT: CarBikeKharido.com ===
Date: ${report.timestamp}
Target: ${report.target}

1. CONSOLE & JAVASCRIPT ERRORS (${report.consoleErrors.length}):
${report.consoleErrors.map(e => `  - ${e}`).join('\n') || '  None detected.'}

2. BROKEN / 404 NETWORK ASSETS (${report.failedRequests.length}):
${report.failedRequests.map(r => `  - [${r.status}] ${r.url}`).join('\n') || '  None detected.'}

3. BROKEN NAVIGATION LINKS (${report.brokenLinks.length}):
${report.brokenLinks.map(b => `  - [${b.status || 'FAIL'}] ${b.url}`).join('\n') || '  All internal links healthy.'}

4. MISSING / ZERO-BYTE IMAGES (${report.missingImages.length}):
${report.missingImages.map(i => `  - [Missing] src: ${i.src} (alt: "${i.alt}")`).join('\n') || '  All images loaded successfully.'}

5. DISABLED BUTTONS (${report.unclickableButtons.length}):
${report.unclickableButtons.map(btn => `  - "${btn.text || btn.ariaLabel || 'Unnamed Button'}" (Disabled)`).join('\n') || '  All buttons active.'}
==============================================
`;

  fs.writeFileSync('smoke_test_results.txt', summaryOutput.trim());
  console.log(summaryOutput);
  console.log('\nReport saved to smoke_test_results.txt');
})();