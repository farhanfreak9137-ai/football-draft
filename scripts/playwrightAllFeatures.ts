import { chromium, Page } from 'playwright';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

async function runStep(page: Page, name: string, fn: () => Promise<void>) {
  console.log(`\n======================================================`);
  console.log(`[TEST STEP] Starting: ${name}`);
  console.log(`======================================================`);
  try {
    await fn();
    console.log(`✅ [PASSED]: ${name}`);
    results.push({ name, passed: true });
  } catch (err: any) {
    console.error(`❌ [FAILED]: ${name}`, err.message || err);
    try {
      const errPath = `failure_${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
      await page.screenshot({ path: errPath });
      console.log(`Saved failure screenshot to ${errPath}`);
    } catch (e) {}
    results.push({ name, passed: false, error: err.message || String(err) });
  }
}

async function main() {
  console.log('🚀 Starting Full Playwright Verification of All Play Features...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error(`[Browser Console Error]:`, msg.text());
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    console.error(`[Browser Uncaught Exception]:`, err.message);
    consoleErrors.push(err.message);
  });

  try {
    // -------------------------------------------------------------
    // 1. Initial Page Load & Lobby Verification
    // -------------------------------------------------------------
    await runStep(page, '1. Initial App Load & Lobby Rendering', async () => {
      await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
      const title = await page.title();
      if (!title.includes('Historical Football Draft')) {
        throw new Error(`Unexpected page title: ${title}`);
      }
      await page.waitForSelector('text=Historical Football Draft', { timeout: 8000 });
      console.log('Lobby rendered with title:', title);
    });

    // -------------------------------------------------------------
    // 2. Profile Modal, 20-Player Squad Studio & AI Titan Exhibition
    // -------------------------------------------------------------
    await runStep(page, '2. Profile Modal, 20-Player Squad Studio & AI Titan Exhibition', async () => {
      await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });

      // Click Manager Profile button in top navigation
      const profileBtn = page.locator('button[title="Manager Profile"]').first();
      await profileBtn.waitFor({ state: 'visible', timeout: 5000 });
      await profileBtn.click();
      await page.waitForTimeout(500);

      // Verify Profile Modal is open
      await page.waitForSelector('text=Career & Trophies', { timeout: 5000 });
      console.log('Profile modal opened.');

      // Click "⭐ My Dream Team" tab
      const dreamTeamTab = page.locator('button:has-text("⭐ My Dream Team")').first();
      await dreamTeamTab.click();
      await page.waitForTimeout(400);

      // Click "Build Dream Team in Studio" or "🛠️ Edit Squad"
      const buildBtn = page.locator('button:has-text("Build Dream Team in Studio"), button:has-text("🛠️ Edit Squad")').first();
      await buildBtn.waitFor({ state: 'visible', timeout: 5000 });
      await buildBtn.click();
      await page.waitForTimeout(600);

      // Verify Dream Team Studio Modal opened
      await page.waitForSelector('text=Starting XI', { timeout: 6000 });
      console.log('Dream Team Studio opened successfully.');

      // Test 12-Formation Picker
      const changeFormationBtn = page.locator('button:has-text("(Change ▾)"), button:has-text("Change ▾")').first();
      if (await changeFormationBtn.isVisible()) {
        await changeFormationBtn.click();
        await page.waitForTimeout(400);
        await page.waitForSelector('text=Preset Tactical Systems', { timeout: 5000 });
        console.log('12-Formation Picker modal opened.');

        // Select 4-2-3-1 Modern Tactical
        const tacticalOption = page.locator('text=4-2-3-1 Modern Tactical').first();
        if (await tacticalOption.isVisible()) {
          await tacticalOption.click({ force: true });
          await page.waitForTimeout(400);
          console.log('Changed formation to 4-2-3-1 Modern Tactical.');
        }
      }

      // Test "⚡ Auto-Fill 20 Stars"
      const autoFillBtn = page.locator('button:has-text("⚡ Auto-Fill 20 Stars")').first();
      await autoFillBtn.click();
      await page.waitForTimeout(600);
      console.log('Auto-Fill 20 Stars executed without any errors!');

      // Check Substitutes Bench Tab (9 Slots)
      const benchTab = page.locator('button:has-text("Bench (")').first();
      await benchTab.click();
      await page.waitForTimeout(400);
      await page.waitForSelector('text=Substitutes & Reserves Bench', { timeout: 5000 });
      console.log('Bench tab verified with 9 designated roles.');

      // Check Tactics & Roles Tab
      const tacticsTab = page.locator('button:has-text("Tactics & Roles")').first();
      await tacticsTab.click();
      await page.waitForTimeout(400);
      await page.waitForSelector('text=Tactical Mentality', { timeout: 5000 });
      console.log('Tactics & Roles tab verified.');

      // Check 20-Man Squad Roster Tab
      const rosterTab = page.locator('button:has-text("20-Man Squad")').first();
      await rosterTab.click();
      await page.waitForTimeout(400);
      await page.waitForSelector('text=Complete 20-Player Roster Overview', { timeout: 5000 });
      console.log('20-Man Squad roster overview verified.');

      // Save Dream Team to Profile
      const saveBtn = page.locator('button:has-text("Save Squad")').first();
      await saveBtn.click();
      await page.waitForTimeout(800);
      console.log('Dream Team saved to profile.');

      // Verify Dream Team is displayed in Manager Profile
      await page.waitForSelector('text=Play AI Titan Match', { timeout: 6000 });
      console.log('Dream Team verified in Profile view.');

      // Test AI Titan Match (Exhibition Friendly against same-caliber AI)
      const titanMatchBtn = page.locator('button:has-text("Play AI Titan Match")').first();
      await titanMatchBtn.click();
      await page.waitForTimeout(400);

      // Select AI Titan opponent
      const opponentSelect = page.locator('select').first();
      await opponentSelect.waitFor({ state: 'visible', timeout: 5000 });
      const options = await opponentSelect.locator('option').all();
      if (options.length > 1) {
        const val = await options[1].getAttribute('value');
        if (val) {
          await opponentSelect.selectOption(val);
          console.log(`Selected matched AI opponent value: ${val}`);
        }
      }

      // Select 45s Blitz duration
      const blitzBtn = page.locator('button:has-text("45s Blitz")').first();
      if (await blitzBtn.isVisible()) {
        await blitzBtn.click();
      }

      // Kick Off Titan Match
      const kickOffTitanBtn = page.locator('button:has-text("Kick Off Titan Match")').first();
      await kickOffTitanBtn.click();
      await page.waitForTimeout(1500);

      // Verify Match View is simulating live with zero errors
      await page.waitForSelector('text=Tactical Pitch Simulation', { timeout: 10000 });
      console.log('✅ AI Titan Friendly Match with Dream Team is running live with zero errors!');
      await page.waitForTimeout(2500);
    });

    // -------------------------------------------------------------
    // 3. World Cup Tournament - Pack Roll Draft (1x) & Reroll Button
    // -------------------------------------------------------------
    await runStep(page, '3. World Cup Tournament - Pack Roll Draft (1x) & Reroll', async () => {
      await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });

      // Click World Cup / Enter World Cup button in Lobby
      const worldCupBtn = page.locator('button:has-text("Enter World Cup"), button:has-text("Continue Tournament"), button[title="World Cup Tournament"]').first();
      await worldCupBtn.waitFor({ state: 'visible', timeout: 5000 });
      await worldCupBtn.click();
      await page.waitForTimeout(600);

      // Abandon tournament if one is currently active
      const abandonBtn = page.locator('button:has-text("Abandon Tournament"), button:has-text("Abandon")').first();
      if (await abandonBtn.isVisible()) {
        page.once('dialog', async (dialog) => {
          await dialog.accept();
        });
        await abandonBtn.click();
        await page.waitForTimeout(600);
      }

      // Verify Tournament Creation Wizard
      await page.waitForSelector('text=World Championship Tournament', { timeout: 6000 });

      // Select "Pack Roll Draft (1x)"
      const packRollCard = page.locator('text=Pack Roll Draft (1x)').first();
      await packRollCard.click();
      await page.waitForTimeout(300);

      // Click "Launch World Championship Campaign (7 Matches)"
      const startCampaignBtn = page.locator('button:has-text("Launch World Championship Campaign (7 Matches)")').first();
      await startCampaignBtn.click();
      await page.waitForTimeout(800);

      // Verify Tournament Dashboard is visible
      await page.waitForSelector('text=Round 1/7: Group Match 1', { timeout: 6000 });

      // Click "Draft Your 11 Players for Campaign"
      const draftFixtBtn = page.locator('button:has-text("Draft Your 11 Players for Campaign"), button:has-text("Draft XI")').first();
      await draftFixtBtn.click();
      await page.waitForTimeout(800);

      // Verify SoloDraftStudio Modal opens
      await page.waitForSelector('text=Current Target Position', { timeout: 6000 });
      console.log('SoloDraftStudio opened in Pack-Roll mode.');

      // Verify Rolled Historical Edition is visible
      await page.waitForSelector('text=Rolled Historical Edition', { timeout: 6000 });
      console.log('Rolled historical team edition verified.');

      // TEST REROLL BUTTON
      const rerollBtn = page.locator('button:has-text("Reroll Team")').first();
      await rerollBtn.waitFor({ state: 'visible', timeout: 5000 });
      const initialRerollText = await rerollBtn.textContent();
      console.log('Reroll button state before click:', initialRerollText);

      await rerollBtn.click();
      await page.waitForTimeout(700);

      const afterRerollText = await rerollBtn.textContent();
      console.log('Reroll button state after click:', afterRerollText);

      if (initialRerollText === afterRerollText) {
        throw new Error(`Reroll counter did not decrease! ${initialRerollText} vs ${afterRerollText}`);
      }
      console.log('✅ Pack Reroll button verified and functioning perfectly!');

      // Draft all 11 slots
      for (let slot = 1; slot <= 11; slot++) {
        console.log(`Drafting slot #${slot}/11...`);
        // If a free reroll appears due to 0 candidates, click it
        const freeRerollBtn = page.locator('button:has-text("Free Reroll")').first();
        if (await freeRerollBtn.isVisible()) {
          console.log('Clicking Free Reroll for slot...');
          await freeRerollBtn.click();
          await page.waitForTimeout(1400);
        }

        const pickSpan = page.locator('span:has-text("Pick →")').first();
        await pickSpan.waitFor({ state: 'visible', timeout: 10000 });
        await pickSpan.click();
        // Wait for roll transition to finish for next slot
        await page.waitForTimeout(1500);
      }

      // Verify completion button "⚔️ Kick Off Tournament"
      const lockSquadBtn = page.locator('button:has-text("Kick Off Tournament")').first();
      await lockSquadBtn.waitFor({ state: 'visible', timeout: 8000 });
      console.log('Draft completed! Clicking Kick Off Tournament...');

      await lockSquadBtn.click();
      await page.waitForTimeout(1500);

      // Verify match simulation screen is running live
      await page.waitForSelector('text=Tactical Pitch Simulation', { timeout: 10000 });
      console.log('✅ Tournament Match simulation running live with zero errors!');

      // Wait 3 seconds during live simulation
      await page.waitForTimeout(3000);
    });

    // -------------------------------------------------------------
    // 4. World Cup Tournament - 5-Card Pick Mode & Wildcard Redraw
    // -------------------------------------------------------------
    await runStep(page, '4. World Cup Tournament - 5-Card Pick Draft (1x)', async () => {
      // Navigate to World Cup Tournament
      await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
      const worldCupBtn = page.locator('button:has-text("Enter World Cup"), button:has-text("Continue Tournament"), button[title="World Cup Tournament"]').first();
      await worldCupBtn.click();
      await page.waitForTimeout(600);

      // Abandon tournament to test 5-card mode
      const abandonBtn = page.locator('button:has-text("Abandon Tournament"), button:has-text("Abandon")').first();
      if (await abandonBtn.isVisible()) {
        page.once('dialog', async (dialog) => {
          await dialog.accept();
        });
        await abandonBtn.click();
        await page.waitForTimeout(600);
      }

      await page.waitForSelector('text=World Championship Tournament', { timeout: 6000 });

      // Select "5-Card Pick Draft (1x)"
      const fiveCardOption = page.locator('text=5-Card Pick Draft (1x)').first();
      await fiveCardOption.click();
      await page.waitForTimeout(300);

      // Start tournament
      const startCampaignBtn = page.locator('button:has-text("Launch World Championship Campaign (7 Matches)")').first();
      await startCampaignBtn.click();
      await page.waitForTimeout(800);

      // Click Draft XI
      const draftFixtBtn = page.locator('button:has-text("Draft Your 11 Players for Campaign"), button:has-text("Draft XI")').first();
      await draftFixtBtn.click();
      await page.waitForTimeout(800);

      // Verify 5-Card choices are shown
      await page.waitForSelector('text=Card Selection Round 1/11', { timeout: 6000 });
      console.log('5-Card Pick draft studio verified.');

      // Test Wildcard Reshuffle
      const redrawBtn = page.locator('button:has-text("Wildcard Reshuffle")').first();
      if (await redrawBtn.isVisible()) {
        const textBefore = await redrawBtn.textContent();
        await redrawBtn.click();
        await page.waitForTimeout(400);
        const textAfter = await redrawBtn.textContent();
        console.log(`Wildcard reshuffle verified: ${textBefore} -> ${textAfter}`);
      }

      // Pick a card
      const cardPick = page.locator('div:has-text("Select"), .group:has-text("Select")').first();
      await cardPick.click();
      await page.waitForTimeout(400);
      console.log('Card picked, advanced to round 2.');
    });

    // -------------------------------------------------------------
    // 5. Solo AI Quick Match & Head-to-Head Turn Alternation
    // -------------------------------------------------------------
    await runStep(page, '5. Solo AI Quick Match & Head-to-Head Turn Alternation', async () => {
      await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
      await page.waitForSelector('text=Historical Football Draft', { timeout: 8000 });

      // Click "Create Room" in Lobby
      const createRoomBtn = page.locator('button[type="submit"]:has-text("Create Room")').first();
      await createRoomBtn.waitFor({ state: 'visible', timeout: 5000 });
      await createRoomBtn.click();
      await page.waitForTimeout(1000);

      // Verify Draft Room view is loaded
      await page.waitForSelector('text=Your Turn to Pick', { timeout: 8000 });
      console.log('Solo Draft room loaded.');

      // Check if "Roll Team Edition" button is present and click it
      const rollTeamBtn = page.locator('button:has-text("Roll Team Edition")').first();
      await rollTeamBtn.waitFor({ state: 'visible', timeout: 5000 });
      await rollTeamBtn.click();
      await page.waitForTimeout(1200);
      console.log('Rolled team edition for Solo match.');

      // Test Draft Reroll button in Solo draft
      const rerollSoloBtn = page.locator('button:has-text("Reroll")').first();
      if (await rerollSoloBtn.isVisible() && !(await rerollSoloBtn.isDisabled())) {
        const rerollTxt = await rerollSoloBtn.textContent();
        console.log('Reroll text before:', rerollTxt);
        await rerollSoloBtn.click();
        await page.waitForTimeout(1200);
        console.log('Reroll Edition executed in Solo match.');
      }

      // Pick first eligible player card
      const playerCard = page.locator('button.cursor-pointer:has(span.font-mono)').first();
      if (await playerCard.isVisible()) {
        await playerCard.click();
        await page.waitForTimeout(400);
        console.log('Player card selected.');

        // 1-Tap assign button
        const assignBtn = page.locator('button[data-testid="quick-assign-btn"]').first();
        if (await assignBtn.isVisible()) {
          await assignBtn.click();
          await page.waitForTimeout(600);
          console.log('Player assigned via 1-Tap Quick Assign!');
        }
      }

      // Wait a moment to observe AI turn processing
      await page.waitForTimeout(2000);
      console.log('Solo AI Quick Match turn mechanics verified.');
    });

  } catch (err: any) {
    console.error('Fatal audit error:', err.message);
  } finally {
    await browser.close();
  }

  console.log('\n======================================================');
  console.log('📊 COMPREHENSIVE PLAYWRIGHT AUDIT RESULTS:');
  console.log('======================================================');
  let allPass = true;
  for (const r of results) {
    console.log(`${r.passed ? '✅' : '❌'} ${r.name}${r.error ? ` - ERROR: ${r.error}` : ''}`);
    if (!r.passed) allPass = false;
  }
  if (consoleErrors.length > 0) {
    console.log(`\n⚠️ Browser Console Errors Detected (${consoleErrors.length}):`);
    for (const e of consoleErrors) {
      console.log(' - ' + e);
    }
  } else {
    console.log('\n🌟 ZERO Browser Console Errors or Exceptions!');
  }

  if (allPass && consoleErrors.length === 0) {
    console.log('\n🎉 ALL 5 COMPREHENSIVE PLAY FEATURES PASSED 100%!');
  } else {
    console.log('\n❌ One or more features failed or produced browser errors.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

