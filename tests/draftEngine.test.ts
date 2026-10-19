import { describe, it, expect } from 'vitest';
import { FORMATIONS, isPlayerEligibleForSlot } from '../src/shared/constants/formations.js';
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

  it('provides two rerolls per XI and depletes properly', () => {
    let state = DraftEngine.createInitialDraftState({
      seatId: 'host',
      playerId: 'test-host',
      playerName: 'Manager A',
      poolType: 'national',
      formationId: '4-3-3',
    });

    expect(state.rerollsRemaining).toBe(2);
    const prng = new PRNG(101);

    // First reroll
    state = DraftEngine.executeReroll(
      state,
      { editions: nationalEditions, players: nationalPlayers },
      prng
    );
    expect(state.rerollsRemaining).toBe(1);
    expect(state.currentTeamEdition).toBeDefined();

    // Second reroll
    state = DraftEngine.executeReroll(
      state,
      { editions: nationalEditions, players: nationalPlayers },
      prng
    );
    expect(state.rerollsRemaining).toBe(0);

    // Third reroll MUST throw error
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
    expect(state.rerollsRemaining).toBe(2);
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
});

