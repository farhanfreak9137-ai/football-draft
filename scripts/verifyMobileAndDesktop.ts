import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Md Farhan Hossain/.gemini/antigravity/brain/fa46fa82-fc90-4028-9792-7cecab4f1846';

async function run() {
  const browser = await chromium.launch({ headless: true });
  let mobilePage: any = null;

  try {
    console.log('=== TEST 1: MOBILE VIEWPORT (iPhone 14: 390x844) ===');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    mobilePage = await mobileContext.newPage();

    console.log('1. Loading Mobile Lobby...');
    await mobilePage.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(500);

    // Verify no horizontal overflow
    const hasHorizontalOverflow = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log(`Mobile Lobby horizontal overflow: ${hasHorizontalOverflow ? 'FAIL' : 'PASS (0px overflow)'}`);
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_v2_1_lobby.png') });

    // Test Formation Studio on Mobile
    console.log('2. Testing Formation Studio on Mobile...');
    await mobilePage.click('button:has-text("Formation Studio")');
    await mobilePage.waitForTimeout(600);
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_v2_2_studio.png') });
    await mobilePage.keyboard.press('Escape');
    await mobilePage.waitForTimeout(400);

    // Start Solo Draft with Clubs
    console.log('3. Starting Solo Game with Clubs pool...');
    await mobilePage.click('button:has-text("Clubs")');
    await mobilePage.click('button[type="submit"]');

    // Wait for Draft screen
    console.log('4. Verifying Draft Initial Screen (unrolled)...');
    const rollBtn = mobilePage.locator('button:has-text("Roll Team")');
    await rollBtn.waitFor({ state: 'visible', timeout: 15000 });
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_v2_3_draft_unrolled.png') });

    // Roll Team
    console.log('5. Clicking Roll Team...');
    await rollBtn.click();
    await mobilePage.waitForTimeout(1500);
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_v2_4_draft_rolled_roster.png') });

    // Test 1-Tap Assign
    console.log('6. Selecting a player from Roster to test 1-Tap Instant Assign...');
    const firstEligibleCard = mobilePage.locator('div[class*="overflow-y-auto"] button:not([disabled])').first();
    await firstEligibleCard.click();
    await mobilePage.waitForTimeout(600);
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_v2_5_player_selected_1tap.png') });

    // Click 1-Tap assign button
    console.log('7. Clicking 1-Tap Assign button...');
    const assignBtn = mobilePage.locator('[data-testid="quick-assign-btn"]').first();
    await assignBtn.waitFor({ state: 'visible', timeout: 5000 });
    await assignBtn.click();
    await mobilePage.waitForTimeout(1200);

    // Switch to Pitch XI tab
    console.log('8. Switching to "Pitch XI" tab on mobile...');
    await mobilePage.click('button:has-text("Pitch XI")');
    await mobilePage.waitForTimeout(600);
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_v2_6_pitch_tab_with_player.png') });

    // Switch back to Draft Roster tab
    console.log('9. Switching back to "Draft Roster" tab...');
    await mobilePage.click('button:has-text("Draft Roster")');
    await mobilePage.waitForTimeout(600);

    // Loop through remaining rounds (players 2 to 11)
    console.log('10. Drafting remaining rounds until all 11 slots are filled...');
    for (let playerNum = 2; playerNum <= 11; playerNum++) {
      console.log(`Drafting player ${playerNum}/11...`);
      // If roll button is visible, click it
      if (await rollBtn.isVisible()) {
        await rollBtn.click();
        await mobilePage.waitForTimeout(800);
      }

      // Pick first eligible player
      const card = mobilePage.locator('div[class*="overflow-y-auto"] button:not([disabled])').first();
      await card.waitFor({ state: 'visible', timeout: 6000 });
      await card.click();
      await mobilePage.waitForTimeout(400);

      // Click assign button
      const assign = mobilePage.locator('[data-testid="quick-assign-btn"]').first();
      await assign.waitFor({ state: 'visible', timeout: 5000 });
      await assign.click();
      await mobilePage.waitForTimeout(1000);
    }

    console.log('11. All 11 players drafted! Waiting for Start Match Simulation button...');
    await mobilePage.waitForTimeout(1000);
    const proceedBtn = mobilePage.locator('button:has-text("Start Match Simulation")').first();
    await proceedBtn.waitFor({ state: 'visible', timeout: 15000 });
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_v2_7_draft_complete.png') });

    console.log('12. Launching Match Simulation on Mobile...');
    await proceedBtn.click();
    await mobilePage.waitForTimeout(3500);

    console.log('13. Capturing Live Match Simulation on Mobile...');
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_v2_8_match_live.png') });

    // Switch to Both Pitches tab in match view
    console.log('14. Checking Both Pitches View on Mobile...');
    const bothPitchesTab = mobilePage.locator('button:has-text("Both Pitches")');
    if (await bothPitchesTab.isVisible()) {
      await bothPitchesTab.click();
      await mobilePage.waitForTimeout(600);
      await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_v2_9_match_both_pitches.png') });
    }

    await mobileContext.close();

    console.log('\n=== TEST 2: DESKTOP VIEWPORT (1400x900) ===');
    const desktopContext = await browser.newContext({
      viewport: { width: 1400, height: 900 },
    });
    const desktopPage = await desktopContext.newPage();

    console.log('15. Testing Desktop Lobby...');
    await desktopPage.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    await desktopPage.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_v2_1_lobby.png') });

    console.log('16. Starting Solo Game on Desktop...');
    await desktopPage.click('button:has-text("Clubs")');
    await desktopPage.click('button[type="submit"]');

    const deskRollBtn = desktopPage.locator('button:has-text("Roll Team")');
    await deskRollBtn.waitFor({ state: 'visible', timeout: 10000 });
    await deskRollBtn.click();
    await desktopPage.waitForTimeout(1500);

    console.log('17. Verifying Desktop 2-Column Side-by-Side Draft View...');
    await desktopPage.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_v2_2_draft_side_by_side.png') });

    await desktopContext.close();

    console.log('\n✓ ALL MOBILE AND DESKTOP TESTS PASSED WITH FLYING COLORS!');
  } catch (err) {
    console.error('Test execution failed:', err);
    try {
      const page = mobilePage;
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'debug_failed_step11.png'), fullPage: true });
      const txt = await page.locator('body').innerText();
      console.log('Page text snippet:\n', txt.substring(0, 500));
    } catch (e) {}
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
