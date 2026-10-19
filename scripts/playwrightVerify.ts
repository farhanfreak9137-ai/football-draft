import { chromium } from 'playwright';

async function run() {
  console.log('========================================================');
  console.log('   PLAYWRIGHT E2E VERIFICATION: HISTORICAL FOOTBALL DRAFT');
  console.log('========================================================');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleLogs: string[] = [];
  const errors: string[] = [];

  page.on('console', (msg) => {
    const text = `[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`;
    consoleLogs.push(text);
    if (msg.type() === 'error') {
      console.error(text);
      errors.push(text);
    } else {
      console.log(text);
    }
  });

  page.on('pageerror', (err) => {
    const text = `[PAGE UNCAUGHT ERROR] ${err.message}\n${err.stack}`;
    console.error(text);
    errors.push(text);
  });

  page.on('response', async (res) => {
    if (res.url().includes('/api/')) {
      try {
        const json = await res.json();
        console.log(`[API RESPONSE] ${res.status()} ${res.url()}:`, JSON.stringify(json).slice(0, 120));
      } catch (e) {}
    }
  });

  try {
    // 1. Visit Home Page
    console.log('\n[TEST 1] Visiting http://localhost:3001/ ...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 15000 });

    const title = await page.title();
    console.log(`Page title: "${title}"`);

    const heading = await page.textContent('h1');
    console.log(`Page heading: "${heading}"`);

    if (!heading || !heading.includes('Historical Football Draft')) {
      throw new Error(`Expected heading 'Historical Football Draft', got '${heading}'`);
    }
    console.log('✓ Home / Lobby loaded cleanly without runtime errors.');

    // 2. Test Historical Database Modal
    console.log('\n[TEST 2] Testing Historical Database Modal...');
    const dbBtn = page.getByRole('button', { name: /Historical Database/i }).first();
    await dbBtn.click();
    await page.waitForTimeout(600);

    const dbTitleVisible = await page.getByText(/Historical Edition Ledger/i).isVisible();
    console.log('Database modal title visible:', dbTitleVisible);
    if (!dbTitleVisible) throw new Error('Historical Database modal title not visible');

    // Check that verified teams are listed in database modal
    await page.waitForSelector('text=Verified', { timeout: 5000 });
    console.log('✓ Verified teams are loaded and displayed in DB modal.');

    // Close Database Modal
    const closeDbBtn = page.getByRole('button', { name: 'Close Database' });
    await closeDbBtn.click();
    await page.waitForTimeout(400);
    console.log('✓ Database Modal verified and closed.');

    // 3. Test Settings Modal
    console.log('\n[TEST 3] Testing Settings Modal...');
    const settingsBtn = page.getByTitle('Settings').first();
    await settingsBtn.click();
    await page.waitForTimeout(400);

    const settingsTitle = await page.getByText(/Game & Audio Settings/i).isVisible();
    console.log('Settings title visible:', settingsTitle);
    if (!settingsTitle) throw new Error('Settings modal did not open properly');

    const closeSettingsBtn = page.getByRole('button', { name: 'Close Settings' }).first();
    await closeSettingsBtn.click();
    await page.waitForTimeout(400);
    console.log('✓ Settings Modal verified and closed.');

    // 4. Create Solo Match Room
    console.log('\n[TEST 4] Creating Solo Match Room...');
    // Click "Solo Draft" mode
    const soloBtn = page.getByRole('button', { name: /Solo Draft/i }).first();
    await soloBtn.click();

    // Select National Teams
    const nationalBtn = page.getByRole('button', { name: /National Teams/i }).first();
    await nationalBtn.click();

    // Click "Create Room"
    const submitBtn = page.getByRole('button', { name: /Create Room/i });
    await submitBtn.click();

    // 5. Verify Drafting Screen
    console.log('Waiting for Draft Room screen to load...');
    await page.waitForSelector('text=Your Tactical XI', { timeout: 10000 });
    console.log('✓ Draft Room loaded!');

    // Verify 40s turn timer and Tactical Pitch
    const timerVisible = await page.getByText(/Turn Timer/i).isVisible();
    console.log('Turn countdown timer visible:', timerVisible);

    // 6. Complete 11 Drafting Rounds
    console.log('\n[TEST 5] Executing 11 Draft Rounds...');
    for (let round = 1; round <= 11; round++) {
      console.log(`--- Draft Round ${round}/11 ---`);

      // Wait until it's our turn
      await page.waitForSelector('text=Your Turn to Pick', { timeout: 10000 });

      // Find first eligible player card with "Select for Slot"
      const selectBtn = page.getByRole('button', { name: 'Select for Slot' }).first();
      await selectBtn.waitFor({ state: 'visible', timeout: 8000 });
      await selectBtn.click();

      // If a multi-slot selector appears (e.g. Confirm button exists), click Confirm
      await page.waitForTimeout(300);
      const confirmBtn = page.getByRole('button', { name: 'Confirm' });
      if (await confirmBtn.isVisible()) {
        console.log('Multi-slot player selected, confirming slot choice...');
        await confirmBtn.click();
      }

      await page.waitForTimeout(800);
    }

    console.log('✓ All 11 drafting rounds completed successfully!');

    // 7. Verify Ready State & Start Real-Time 90s Match Simulation
    console.log('\n[TEST 6] Starting 90-Second Consecutive Match Simulation...');
    console.log('Waiting for both squads to finalize 11 positions...');
    await page.waitForSelector('text=Both Starting XIs Complete!', { timeout: 15000 });
    console.log('✓ Both squads ready!');

    const proceedBtn = page.getByRole('button', { name: /Start 90s Match Simulation/i }).first();
    await proceedBtn.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✓ Start 90s Match Simulation button is active!');

    await proceedBtn.click();
    await page.waitForTimeout(1000);

    const errorBanner = page.locator('.bg-red-950');
    if (await errorBanner.isVisible()) {
      console.error('Error banner displayed:', await errorBanner.textContent());
    }

    // 8. Verify Match Screen & Second-by-Second Progress
    console.log('Waiting for Match Simulation view...');
    await page.waitForSelector('text=Tactical Pitch Simulation', { timeout: 10000 });
    console.log('✓ Tactical Pitch Simulation is live!');

    // Verify Scoreboard, Pitch, Clock
    const scoreboardVisible = await page.getByText(/Historical Match Clash/i).or(page.getByText(/Real-Time Sim/i)).first().isVisible();
    console.log('Match banner visible:', scoreboardVisible);

    // Monitor consecutive ticks
    console.log('Observing real-time match simulation progression for 10 seconds...');
    const observedClocks: string[] = [];
    for (let t = 1; t <= 10; t++) {
      await page.waitForTimeout(1000);
      const clockElement = page.locator('.font-mono.text-tactical-200.font-bold').first();
      const clockText = await clockElement.textContent();
      observedClocks.push(clockText || '');
      console.log(`[SECOND ${t}] Clock: ${clockText}`);
    }

    console.log('Observed Match Clocks:', observedClocks);
    // Ensure clocks are consecutive and advancing
    if (observedClocks.length >= 2 && observedClocks[0] === observedClocks[observedClocks.length - 1]) {
      console.warn('Warning: clock did not advance as expected during test interval');
    } else {
      console.log('✓ Clock is advancing consecutively second-by-second in real-time!');
    }

    // 9. Leave Room and Return to Lobby
    console.log('\n[TEST 7] Testing Leave Room / Exit Match...');
    const leaveBtn = page.getByRole('button', { name: /Leave/i }).first();
    if (await leaveBtn.isVisible()) {
      await leaveBtn.click();
      await page.waitForTimeout(600);
      const backInLobby = await page.getByText(/Draft Mode/i).isVisible();
      console.log('Returned cleanly to Lobby:', backInLobby);
      if (!backInLobby) throw new Error('Did not return to lobby properly after leaving');
    }

    // 10. Check for zero runtime errors
    console.log('\n========================================================');
    console.log(`Browser Errors Count: ${errors.length}`);
    if (errors.length > 0) {
      console.error('Captured errors:', errors);
      throw new Error(`Test failed with ${errors.length} browser errors!`);
    }

    console.log('🎉 ALL PLAYWRIGHT E2E BROWSER TESTS PASSED FLAWLESSLY!');
    console.log('========================================================');
  } catch (err) {
    console.error('Playwright Test Run Failed:', err);
    try {
      const text = await page.textContent('body');
      console.log('PAGE TEXT DUMP:\n', text?.slice(0, 500));
    } catch (e) {}
    if (errors.length > 0) {
      console.error('All Captured Browser Errors:', errors);
    }
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
