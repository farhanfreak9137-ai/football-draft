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
    console.log('Navigating to Lobby...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });

    console.log('Creating Solo game with National pool...');
    await page.click('button:has-text("National Teams")');
    await page.click('button[type="submit"]');

    const rollBtn = page.locator('button:has-text("Roll Team")');
    await rollBtn.waitFor({ state: 'visible', timeout: 10000 });

    console.log('Drafting full 11 players to test match simulation...');
    for (let round = 1; round <= 11; round++) {
      console.log(`Round ${round}/11...`);
      // Scroll to roll button if visible
      if (await rollBtn.isVisible()) {
        await rollBtn.click();
        await page.waitForTimeout(700);
      }

      // Find an enabled player card
      const playerCard = page.locator('div[class*="overflow-y-auto"] button:not([disabled])').first();
      await playerCard.waitFor({ state: 'visible', timeout: 5000 });
      await playerCard.click();
      await page.waitForTimeout(500);

      // Now click glowing slot on the pitch
      const highlightedSlot = page.locator('.animate-pulse').first();
      await highlightedSlot.waitFor({ state: 'visible', timeout: 5000 });
      await highlightedSlot.click();
      await page.waitForTimeout(1000);
    }

    console.log('Waiting for both drafts to complete...');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_audit_draft_end.png'), fullPage: true });

    const proceedBtn = page.locator('button:has-text("Proceed to Match")').first();
    if (await proceedBtn.isVisible()) {
      console.log('Clicking Proceed to Match...');
      await proceedBtn.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_audit_match_live.png'), fullPage: true });
    } else {
      console.log('Proceed to Match not visible, checking page text...');
      const bodyText = await page.locator('body').innerText();
      console.log('Body snippet:', bodyText.substring(0, 300));
    }

    console.log('Audit completed successfully!');
  } catch (err) {
    console.error('Audit failed:', err);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_audit_failed_state.png'), fullPage: true });
  } finally {
    await browser.close();
  }
}

audit();
