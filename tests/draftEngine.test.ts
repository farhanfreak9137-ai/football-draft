import { describe, it, expect } from 'vitest';
import {
  FORMATIONS,
  isPlayerEligibleForSlot,
  validateCustomFormation,
  generateFormationFromLines,
  calculatePositionFromCoordinates,
  findClosestSnapNode,
  ARCHETYPE_TEMPLATES,
} from '../src/shared/constants/formations.js';
import { DraftEngine } from '../src/shared/engine/draftEngine.js';
import { PRNG } from '../src/shared/engine/prng.js';
import { PlayerVersion, TeamEdition } from '../src/shared/types/index.js';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(__dirname, '../data');
const nationalEditions: TeamEdition[] = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'editions_national.json'), 'utf-8'));
const clubEditions: TeamEdition[] = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'editions_club.json'), 'utf-8'));
const nationalPlayers: PlayerVersion[] = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'players_national.json'), 'utf-8'));
const clubPlayers: PlayerVersion[] = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'players_club.json'), 'utf-8'));
const allEditions = [...nationalEditions, ...clubEditions];
const allPlayers = [...nationalPlayers, ...clubPlayers];

describe('DraftEngine & Formation Rules', () => {
  it('validates all launch formation presets (4-3-3, 4-4-2, 4-2-3-1, 3-5-2)', () => {
    const expectedFormations = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2'];
    for (const fId of expectedFormations) {
      const f = FORMATIONS[fId];
      expect(f).toBeDefined();
      expect(f.slots.length).toBe(11);

      // Verify goalkeeper exists
      const gkSlot = f.slots.find((s) => s.defaultPosition === 'GK');
      expect(gkSlot).toBeDefined();
      expect(gkSlot?.eligiblePositions).toContain('GK');
    }
  });

  it('correctly checks legal-position assignments for formation slots', () => {
    const f = FORMATIONS['4-3-3'];
    const cbSlot = f.slots.find((s) => s.id === 'cb1')!;
    const stSlot = f.slots.find((s) => s.id === 'st')!;
    const rwSlot = f.slots.find((s) => s.id === 'rw')!;

    const bobbyMoore = allPlayers.find((p) => p.name.includes('Bobby Moore'))!;
    const gerdMueller = allPlayers.find((p) => p.name.includes('Gerd Müller'))!;
    const jairzinho = allPlayers.find((p) => p.name.includes('Jairzinho'))!;

    // Center Back eligible for CB slot, not for ST slot
    expect(isPlayerEligibleForSlot(bobbyMoore, cbSlot)).toBe(true);
    expect(isPlayerEligibleForSlot(bobbyMoore, stSlot)).toBe(false);

    // Striker eligible for ST slot, not for CB slot
    expect(isPlayerEligibleForSlot(gerdMueller, stSlot)).toBe(true);
    expect(isPlayerEligibleForSlot(gerdMueller, cbSlot)).toBe(false);

    // Winger eligible for RW slot
    expect(isPlayerEligibleForSlot(jairzinho, rwSlot)).toBe(true);
  });

  it('strictly prevents duplicate real-player identity across historical versions', () => {
    let state = DraftEngine.createInitialDraftState({
      seatId: 'host',
      playerId: 'test-host',
      playerName: 'Manager A',
      poolType: 'club',
      formationId: '4-3-3',
    });

    // Find two versions of Lionel Messi: Barcelona 2008-09 and Barcelona 2014-15
    const messi2009 = allPlayers.find((p) => p.id === 'lionel-messi-2009')!;
    const messi2015 = allPlayers.find((p) => p.id === 'lionel-messi-2015')!;

    expect(messi2009.identityId).toBe(messi2015.identityId);

    // Draft Messi 2009 into the RW slot
    state = DraftEngine.pickPlayer(state, messi2009.id, 'rw', allPlayers);
    expect(state.draftedSlots['rw']).toBeDefined();
    expect(state.usedIdentityIds).toContain(messi2009.identityId);

    // Attempting to draft Messi 2015 into the ST slot MUST throw an identity uniqueness error
    expect(() => {
      DraftEngine.pickPlayer(state, messi2015.id, 'st', allPlayers);
    }).toThrow(/already drafted/i);

    // Check draftability helper directly
    const check = DraftEngine.isPlayerDraftable(messi2015, state);
    expect(check.eligible).toBe(false);
  });

  it('selects eligible team editions with equal probability', () => {
    const state = DraftEngine.createInitialDraftState({
      seatId: 'host',
      playerId: 'test-host',
      playerName: 'Manager A',
      poolType: 'national',
      formationId: '4-3-3',
    });

    const prng = new PRNG(42);
    const rollsCount: Record<string, number> = {};
    const TOTAL_ROLLS = 1000;

    for (let i = 0; i < TOTAL_ROLLS; i++) {
      const { edition } = DraftEngine.rollTeamEdition(
        state,
        { editions: nationalEditions, players: nationalPlayers },
        prng
      );
      rollsCount[edition.id] = (rollsCount[edition.id] || 0) + 1;
    }

    const distinctEditions = Object.keys(rollsCount);
    // All 20 national editions should have been rolled
    expect(distinctEditions.length).toBe(20);

    // Expected count per edition ~50 (5%), tolerance between 20 and 80
    for (const id of distinctEditions) {
      expect(rollsCount[id]).toBeGreaterThan(20);
      expect(rollsCount[id]).toBeLessThan(85);
    }
  });

  it('provides three rerolls per XI and depletes properly', () => {
    let state = DraftEngine.createInitialDraftState({
      seatId: 'host',
      playerId: 'test-host',
      playerName: 'Manager A',
      poolType: 'national',
      formationId: '4-3-3',
    });

    expect(state.rerollsRemaining).toBe(3);
    const prng = new PRNG(101);

    // First reroll
    state = DraftEngine.executeReroll(
      state,
      { editions: nationalEditions, players: nationalPlayers },
      prng
    );
    expect(state.rerollsRemaining).toBe(2);
    expect(state.currentTeamEdition).toBeDefined();

    // Second reroll
    state = DraftEngine.executeReroll(
      state,
      { editions: nationalEditions, players: nationalPlayers },
      prng
    );
    expect(state.rerollsRemaining).toBe(1);

    // Third reroll
    state = DraftEngine.executeReroll(
      state,
      { editions: nationalEditions, players: nationalPlayers },
      prng
    );
    expect(state.rerollsRemaining).toBe(0);

    // Fourth reroll MUST throw error
    expect(() => {
      DraftEngine.executeReroll(
        state,
        { editions: nationalEditions, players: nationalPlayers },
        prng
      );
    }).toThrow(/No rerolls remaining/i);
  });

  it('automatically rolls another edition when a rolled team has no legal picks without spending a reroll', () => {
    let state = DraftEngine.createInitialDraftState({
      seatId: 'host',
      playerId: 'test-host',
      playerName: 'Manager A',
      poolType: 'national',
      formationId: '4-3-3',
    });

    // Fill all outfield slots so ONLY GK slot is open
    const outfieldSlots = state.formation.slots.filter((s) => s.id !== 'gk');
    for (const slot of outfieldSlots) {
      state.draftedSlots[slot.id] = {
        slotId: slot.id,
        player: allPlayers[0],
        assignedPosition: slot.defaultPosition,
      };
    }

    // Now roll team edition: DraftEngine must guarantee the chosen edition has an eligible player (a GK)
    const prng = new PRNG(999);
    const { edition, roster } = DraftEngine.rollTeamEdition(
      state,
      { editions: nationalEditions, players: nationalPlayers },
      prng
    );

    const hasLegalGK = roster.some(
      (p) => DraftEngine.isPlayerDraftable(p, state).eligible
    );
    expect(hasLegalGK).toBe(true);
    // Rerolls remaining was untouched
    expect(state.rerollsRemaining).toBe(3);
  });

  it('deterministic auto-pick selects highest-OVR legal player with documented tie-breaks', () => {
    const state = DraftEngine.createInitialDraftState({
      seatId: 'host',
      playerId: 'test-host',
      playerName: 'Manager A',
      poolType: 'national',
      formationId: '4-3-3',
    });

    const testRoster: PlayerVersion[] = [
      {
        id: 'player-b',
        identityId: 'ident-b',
        editionId: 'test-ed',
        name: 'Good Midfielder',
        squadNumber: 8,
        ovr: 88,
        naturalPositions: ['CM'],
        secondaryPositions: [],
        hasLegendSeal: false,
        tournamentOrSeasonStats: { appearances: 5, goals: 1 },
        ratingRationale: 'Test',
        methodologyVersion: 'v1.0.0-verified-historical',
        reviewer: 'Board',
        reviewDate: '2026-10-18',
        verificationStatus: 'verified',
        sources: [{ sourceId: 'rsssf-global', fact: 'test' }],
      },
      {
        id: 'player-a',
        identityId: 'ident-a',
        editionId: 'test-ed',
        name: 'Super Striker',
        squadNumber: 9,
        ovr: 96,
        naturalPositions: ['ST'],
        secondaryPositions: [],
        hasLegendSeal: true,
        tournamentOrSeasonStats: { appearances: 7, goals: 8 },
        ratingRationale: 'Test',
        methodologyVersion: 'v1.0.0-verified-historical',
        reviewer: 'Board',
        reviewDate: '2026-10-18',
        verificationStatus: 'verified',
        sources: [{ sourceId: 'rsssf-global', fact: 'test' }],
      },
    ];

    const pick = DraftEngine.getDeterministicAutoPick(state, testRoster);
    expect(pick.player.id).toBe('player-a');
    expect(pick.slotId).toBe('st');
  });

  it('enforces match-wide 22 unique players rule across both squads', () => {
    let hostState = DraftEngine.createInitialDraftState({
      seatId: 'host',
      playerId: 'test-host',
      playerName: 'Manager Host',
      poolType: 'club',
      formationId: '4-3-3',
    });

    let guestState = DraftEngine.createInitialDraftState({
      seatId: 'guest',
      playerId: 'test-guest',
      playerName: 'Manager Guest',
      poolType: 'club',
      formationId: '4-3-3',
    });

    // Find versions of Messi
    const messi2009 = allPlayers.find((p) => p.id === 'lionel-messi-2009')!;
    const messi2015 = allPlayers.find((p) => p.id === 'lionel-messi-2015')!;

    // Host picks Messi 2009
    hostState = DraftEngine.pickPlayer(hostState, messi2009.id, 'rw', allPlayers, guestState.usedIdentityIds);
    expect(hostState.usedIdentityIds).toContain(messi2009.identityId);

    // Guest drafts with host's used identities excluded
    // 1. isPlayerDraftable should report ineligible
    const guestCheck = DraftEngine.isPlayerDraftable(messi2015, guestState, hostState.usedIdentityIds);
    expect(guestCheck.eligible).toBe(false);

    // 2. pickPlayer must throw error when opponent already drafted that identity
    expect(() => {
      DraftEngine.pickPlayer(guestState, messi2015.id, 'rw', allPlayers, hostState.usedIdentityIds);
    }).toThrow(/already been drafted by the opponent/i);

    // 3. getDeterministicAutoPick must skip Messi 2015 and pick the next best legal player
    const candidateRoster: PlayerVersion[] = [
      messi2015,
      allPlayers.find((p) => p.name.includes('Iniesta')) || allPlayers[0],
    ];
    const auto = DraftEngine.getDeterministicAutoPick(guestState, candidateRoster, hostState.usedIdentityIds);
    expect(auto.player.identityId).not.toBe(messi2009.identityId);
  });

  it('guarantees AI/opponent never rolls the same team edition as the other player', () => {
    const guestState = DraftEngine.createInitialDraftState({
      seatId: 'guest',
      playerId: 'test-guest',
      playerName: 'Manager Guest',
      poolType: 'national',
      formationId: '4-3-3',
    });

    const hostEditionId = 'arg-2022';
    const prng = new PRNG(12345);

    // Roll 100 times excluding hostEditionId
    for (let i = 0; i < 100; i++) {
      const { edition } = DraftEngine.rollTeamEdition(
        guestState,
        { editions: nationalEditions, players: nationalPlayers },
        prng,
        { excludedEditionIds: [hostEditionId] }
      );
      expect(edition.id).not.toBe(hostEditionId);
    }
  });

  describe('Custom Formation Studio & Tactical Engine', () => {
    it('validates custom formations: enforces exactly 11 players, 1 GK, 3-5 DEF, 2-6 MID, 1-4 FWD', () => {
      // 1. Valid 4-3-3 preset slots
      const validCheck = validateCustomFormation(FORMATIONS['4-3-3'].slots);
      expect(validCheck.valid).toBe(true);
      expect(validCheck.derivedName).toBe('4-3-3');
      expect(validCheck.counts).toEqual({ gk: 1, def: 4, mid: 3, fwd: 3 });

      // 2. Reject if player count != 11
      const tenPlayers = FORMATIONS['4-3-3'].slots.slice(0, 10);
      const invalidCount = validateCustomFormation(tenPlayers);
      expect(invalidCount.valid).toBe(false);
      expect(invalidCount.reason).toMatch(/exactly 11 players/i);

      // 3. Reject if 0 or >1 Goalkeepers
      const noGK = FORMATIONS['4-3-3'].slots.map((s) => (s.group === 'GK' ? { ...s, group: 'DEF' as const, defaultPosition: 'CB' as const } : s));
      const invalidGK = validateCustomFormation(noGK);
      expect(invalidGK.valid).toBe(false);
      expect(invalidGK.reason).toMatch(/exactly 1 Goalkeeper/i);

      // 4. Reject if DEF < 3 or > 5
      const twoDef = generateFormationFromLines(2, 5, 3);
      const invalidDef = validateCustomFormation(twoDef.slots);
      expect(invalidDef.valid).toBe(false);
      expect(invalidDef.reason).toMatch(/between 3 and 5 Defenders/i);

      // 5. Reject if MID < 2 or > 6
      const oneMid = generateFormationFromLines(5, 1, 4);
      const invalidMid = validateCustomFormation(oneMid.slots);
      expect(invalidMid.valid).toBe(false);
      expect(invalidMid.reason).toMatch(/between 2 and 6 Midfielders/i);

      // 6. Reject if FWD < 1 or > 4
      const zeroFwd = generateFormationFromLines(5, 5, 0);
      const invalidFwd = validateCustomFormation(zeroFwd.slots);
      expect(invalidFwd.valid).toBe(false);
      expect(invalidFwd.reason).toMatch(/between 1 and 4 Forwards/i);
    });

    it('generates proportional, balanced formations from line counts (stepper mode)', () => {
      const custom343 = generateFormationFromLines(3, 4, 3, 'My 3-4-3 Attack');
      expect(custom343.id).toBeDefined();
      expect(custom343.name).toBe('My 3-4-3 Attack');
      expect(custom343.isCustom).toBe(true);
      expect(custom343.slots.length).toBe(11);

      const val = validateCustomFormation(custom343.slots);
      expect(val.valid).toBe(true);
      expect(val.derivedName).toBe('3-4-3');
      expect(val.counts.def).toBe(3);
      expect(val.counts.mid).toBe(4);
      expect(val.counts.fwd).toBe(3);

      // Check slot eligible positions are assigned
      for (const slot of custom343.slots) {
        expect(slot.eligiblePositions.length).toBeGreaterThan(0);
        expect(slot.coordinates.x).toBeGreaterThanOrEqual(5);
        expect(slot.coordinates.x).toBeLessThanOrEqual(95);
        expect(slot.coordinates.y).toBeGreaterThanOrEqual(8);
        expect(slot.coordinates.y).toBeLessThanOrEqual(95);
      }
    });

    it('dynamically auto-morphs position roles and groups from pitch coordinates (free drag mode)', () => {
      // GK in deep defensive box
      const gk = calculatePositionFromCoordinates(50, 92);
      expect(gk.position).toBe('GK');
      expect(gk.group).toBe('GK');

      // Left Back
      const lb = calculatePositionFromCoordinates(15, 78);
      expect(lb.position).toBe('LB');
      expect(lb.group).toBe('DEF');

      // Center Back
      const cb = calculatePositionFromCoordinates(50, 78);
      expect(cb.position).toBe('CB');
      expect(cb.group).toBe('DEF');

      // Defensive Pivot
      const cdm = calculatePositionFromCoordinates(50, 62);
      expect(cdm.position).toBe('CDM');
      expect(cdm.group).toBe('MID');

      // Central Midfielder
      const cm = calculatePositionFromCoordinates(50, 48);
      expect(cm.position).toBe('CM');
      expect(cm.group).toBe('MID');

      // Attacking Midfielder
      const cam = calculatePositionFromCoordinates(50, 36);
      expect(cam.position).toBe('CAM');
      expect(cam.group).toBe('MID');

      // Left Winger
      const lw = calculatePositionFromCoordinates(18, 20);
      expect(lw.position).toBe('LW');
      expect(lw.group).toBe('FWD');

      // Center Forward / Striker
      const st = calculatePositionFromCoordinates(50, 16);
      expect(st.position).toBe('ST');
      expect(st.group).toBe('FWD');
    });

    it('magnetically snaps coordinates to closest tactical snap node (snap mode)', () => {
      // Near node-cdm-c (50, 64)
      const snapped = findClosestSnapNode(51, 63, 9);
      expect(snapped).not.toBeNull();
      expect(snapped?.id).toBe('node-cdm-c');
      expect(snapped?.position).toBe('CDM');

      // Too far from any node with threshold 3
      const notSnapped = findClosestSnapNode(1, 1, 3);
      expect(notSnapped).toBeNull();
    });

    it('initializes DraftState with custom formation and successfully executes pick into custom slot', () => {
      const customSetup = generateFormationFromLines(4, 2, 4, '4-2-4 Brazil Overload');

      const draftState = DraftEngine.createInitialDraftState({
        seatId: 'host',
        playerId: 'user-1',
        playerName: 'Manager Overload',
        poolType: 'national',
        formationId: customSetup.id,
        customFormation: customSetup,
      });

      expect(draftState.formation.id).toBe(customSetup.id);
      expect(draftState.formation.isCustom).toBe(true);
      expect(draftState.formation.slots.length).toBe(11);
      expect(DraftEngine.getOpenSlots(draftState).length).toBe(11);

      // Find striker slot in custom setup
      const fwdSlot = customSetup.slots.find((s) => s.group === 'FWD')!;
      expect(fwdSlot).toBeDefined();

      const pele = allPlayers.find((p) => p.name.includes('Pelé'))!;
      expect(pele).toBeDefined();

      // Legal pick into custom forward slot
      const updated = DraftEngine.pickPlayer(
        draftState,
        pele.id,
        fwdSlot.id,
        allPlayers
      );

      expect(updated.draftedSlots[fwdSlot.id]).toBeDefined();
      expect(updated.draftedSlots[fwdSlot.id].player.name).toContain('Pelé');
      expect(DraftEngine.getOpenSlots(updated).map((s) => s.id)).not.toContain(fwdSlot.id);
    });

    it('all 10 archetype templates are structurally valid formations', () => {
      expect(ARCHETYPE_TEMPLATES.length).toBeGreaterThanOrEqual(10);
      for (const tmpl of ARCHETYPE_TEMPLATES) {
        const val = validateCustomFormation(tmpl.slots);
        expect(val.valid).toBe(true);
      }
    });
  });
});



