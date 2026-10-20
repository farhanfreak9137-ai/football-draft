import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Md Farhan Hossain/.gemini/antigravity/brain/fa46fa82-fc90-4028-9792-7cecab4f1846';

async function audit() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  try {
    console.log('1. Auditing Lobby on Mobile...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_audit_1_lobby.png'), fullPage: false });

    // Scroll down lobby to see match format, formation selection, etc.
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_audit_1b_lobby_scroll.png'), fullPage: false });

    console.log('2. Starting Solo Game...');
    // Scroll back to top or click Clubs directly
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.click('button:has-text("Clubs")');
    await page.click('button[type="submit"]');

    console.log('3. Auditing Draft Screen (Initial unrolled) on Mobile...');
    const rollBtn = page.locator('button:has-text("Roll Team")');
    await rollBtn.waitFor({ state: 'visible', timeout: 15000 });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_audit_2_draft_initial.png'), fullPage: false });

    console.log('4. Clicking Roll Team...');
    await rollBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_audit_3_draft_rolled.png'), fullPage: false });

    console.log('5. Scrolling down to see Roster on Mobile...');
    await page.evaluate(() => window.scrollBy(0, 450));
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_audit_4_draft_roster.png'), fullPage: false });

    console.log('6. Picking a player...');
    // Click the first pick button
    const pickBtn = page.locator('button:has-text("Pick")').first();
    if (await pickBtn.isVisible()) {
      await pickBtn.click();
      await page.waitForTimeout(1500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_audit_5_pitch_after_pick.png'), fullPage: false });
    }

    console.log('Mobile audit part 1 completed successfully!');
  } catch (err) {
    console.error('Audit failed:', err);
  } finally {
    await browser.close();
  }
}

audit();
