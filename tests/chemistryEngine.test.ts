import { describe, it, expect } from 'vitest';
import { ChemistryEngine } from '../src/shared/engine/chemistryEngine.js';
import { DraftEngine } from '../src/shared/engine/draftEngine.js';
import { HISTORICAL_SCENARIOS } from '../src/shared/constants/scenarios.js';
import { PlayerVersion } from '../src/shared/types/index.js';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(__dirname, '../data');
const nationalPlayers: PlayerVersion[] = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'players_national.json'), 'utf-8'));

function createTestSquad(editionId: string) {
  const state = DraftEngine.createInitialDraftState({
    seatId: 'host',
    playerId: `p-${editionId}`,
    playerName: 'Test Manager',
    poolType: 'national',
    formationId: '4-3-3',
  });

  const roster = nationalPlayers.filter((p) => p.editionId === editionId);
  const slots = state.formation.slots;

  for (let i = 0; i < 11; i++) {
    const slot = slots[i];
    const player = roster[i % roster.length];
    state.draftedSlots[slot.id] = {
      slotId: slot.id,
      player,
      assignedPosition: slot.defaultPosition,
    };
    state.usedIdentityIds.push(player.identityId);
  }
  state.isReady = true;
  return state;
}

describe('ChemistryEngine (Squad Synergy & Position Fidelity)', () => {
  it('correctly evaluates position fidelity based on natural positions and tactical roles', () => {
    // 1. Exact match
    const stScore = ChemistryEngine.evaluatePositionFidelity(['ST'], 'ST', 'FWD');
    expect(stScore).toBe(10);

    // 2. Compatible position in same group (CF playing ST)
    const cfScore = ChemistryEngine.evaluatePositionFidelity(['CF'], 'ST', 'FWD');
    expect(cfScore).toBeGreaterThanOrEqual(7.0);

    // 3. CDM playing CB
    const cdmScore = ChemistryEngine.evaluatePositionFidelity(['CDM'], 'CB', 'DEF');
    expect(cdmScore).toBeLessThanOrEqual(5.0);

    // 4. Pure GK playing as ST (Complete mismatch)
    const gkOutfield = ChemistryEngine.evaluatePositionFidelity(['GK'], 'ST', 'FWD');
    expect(gkOutfield).toBe(1);

    // 5. ST playing as GK
    const stInGoal = ChemistryEngine.evaluatePositionFidelity(['ST'], 'GK', 'GK');
    expect(stInGoal).toBe(1);
  });

  it('calculates comprehensive squad chemistry rating between 0 and 100', () => {
    const squad = createTestSquad('brazil-1970');
    const chemResult = ChemistryEngine.calculateSquadChemistry(squad);

    expect(chemResult.total).toBeGreaterThanOrEqual(0);
    expect(chemResult.total).toBeLessThanOrEqual(100);
    expect(chemResult.positionFidelity).toBeGreaterThanOrEqual(0);
    expect(chemResult.positionFidelity).toBeLessThanOrEqual(50);
    expect(chemResult.synergyBonus).toBeGreaterThanOrEqual(0);
    expect(chemResult.individualStars).toBeGreaterThanOrEqual(0);
  });

  it('translates chemistry differential into tactical advantage modifier', () => {
    const modifierHigh = ChemistryEngine.getTacticalAdvantageModifier(95, 60);
    expect(modifierHigh).toBeGreaterThan(0);
    expect(modifierHigh).toBeLessThanOrEqual(0.06);

    const modifierLow = ChemistryEngine.getTacticalAdvantageModifier(50, 90);
    expect(modifierLow).toBeLessThan(0);
    expect(modifierLow).toBeGreaterThanOrEqual(-0.06);

    const modifierEqual = ChemistryEngine.getTacticalAdvantageModifier(80, 80);
    expect(modifierEqual).toBe(0);
  });

  it('contains verified historical scenarios with proper starting constraints and objectives', () => {
    expect(HISTORICAL_SCENARIOS.length).toBe(4);

    for (const scenario of HISTORICAL_SCENARIOS) {
      expect(scenario.id).toBeDefined();
      expect(scenario.title).toBeDefined();
      expect(scenario.era).toBeDefined();
      expect(scenario.difficulty).toMatch(/normal|hard|legendary/);
      expect(scenario.userTeam.editionId).toBeDefined();
      expect(scenario.opponentTeam.editionId).toBeDefined();
      expect(scenario.startingMinute).toBeGreaterThan(0);
      expect(scenario.startingScore).toBeDefined();
      expect(scenario.objectives.length).toBeGreaterThan(0);
      expect(scenario.rewards.xp).toBeGreaterThan(0);
    }

    const istanbul = HISTORICAL_SCENARIOS.find((s) => s.id === 'miracle-of-istanbul-2005');
    expect(istanbul).toBeDefined();
    expect(istanbul?.startingScore).toEqual({ host: 0, guest: 3 });
    expect(istanbul?.startingMinute).toBe(45);
  });
});
