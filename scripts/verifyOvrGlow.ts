import { chromium } from 'playwright';
import path from 'path';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await context.newPage();

  try {
    console.log('Navigating to http://localhost:3001 ...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });

    // Select Clubs pool
    console.log('Selecting Clubs pool...');
    await page.click('button:has-text("Clubs")');

    // Submit Create Room form
    console.log('Clicking "Create Room"...');
    await page.click('button[type="submit"]');

    // Wait for "Roll Team" button
    console.log('Waiting for "Roll Team" button...');
    const rollBtn = page.locator('button:has-text("Roll Team")');
    await rollBtn.waitFor({ state: 'visible', timeout: 15000 });

    // Roll team
    console.log('Clicking "Roll Team"...');
    await rollBtn.click();
    await page.waitForTimeout(1500);

    // Let's re-roll if needed to find a team with both 95+ and 90-94
    let rolls = 0;
    while (rolls < 3) {
      const pageContent = await page.content();
      // Check for 95+ (like 95, 96, 97, 98, 99)
      if (pageContent.includes('text-red-400') && pageContent.includes('text-gold-400')) {
        console.log('✓ Found squad with BOTH 95-100 (Reddish Glow) and 90-94 (Golden)!');
        break;
      }
      const rerollBtn = page.locator('button:has-text("Re-roll Team")');
      if (await rerollBtn.isVisible()) {
        console.log('Re-rolling for ideal comparison...');
        await rerollBtn.click();
        await page.waitForTimeout(1500);
      }
      rolls++;
    }

    const artifactPath = path.resolve(
      'C:/Users/Md Farhan Hossain/.gemini/antigravity/brain/fa46fa82-fc90-4028-9792-7cecab4f1846/ovr_reddish_glow_superiority.png'
    );
    await page.screenshot({ path: artifactPath, fullPage: true });
    console.log(`✓ Screenshot saved to ${artifactPath}`);

  } catch (err) {
    console.error('Error during OVR glow verification:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();

