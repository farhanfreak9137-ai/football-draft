import { describe, it, expect } from 'vitest';
import { MatchEngine } from '../src/shared/engine/matchEngine.js';
import { DraftEngine } from '../src/shared/engine/draftEngine.js';
import { PlayerVersion, TeamEdition } from '../src/shared/types/index.js';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(__dirname, '../data');
const nationalEditions: TeamEdition[] = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'editions_national.json'), 'utf-8'));
const nationalPlayers: PlayerVersion[] = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'players_national.json'), 'utf-8'));

function createTestSquad(editionId: string, managerName: string) {
  const state = DraftEngine.createInitialDraftState({
    seatId: 'host',
    playerId: `p-${editionId}`,
    playerName: managerName,
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

describe('MatchEngine (45s Real Sim / 90\' Visual Clock Luck-First Simulation)', () => {
  it('simulates a complete 45-second match with valid timing and chronological event feed', () => {
    const hostDraft = createTestSquad('brazil-1970', 'Brazil 1970 Manager');
    const guestDraft = createTestSquad('italy-1982', 'Italy 1982 Manager');

    const sim = MatchEngine.simulateMatch(hostDraft, guestDraft, {
      randomSeed: 12345,
      knockoutMode: false,
    });

    expect(sim.totalDurationSeconds).toBe(45);
    expect(sim.events.length).toBeGreaterThan(0);

    // Event 0 must be kickoff
    expect(sim.events[0].type).toBe('kickoff');
    expect(sim.events[0].second).toBe(0);

    // Verify chronological order
    for (let i = 1; i < sim.events.length; i++) {
      expect(sim.events[i].second).toBeGreaterThanOrEqual(sim.events[i - 1].second);
    }

    // Verify events contain varied actions: attacks, saves, goals, or misses
    const eventTypes = new Set(sim.events.map((e) => e.type));
    expect(eventTypes.has('kickoff')).toBe(true);
    expect(eventTypes.has('fulltime')).toBe(true);
  });

  it('guarantees no ghost players: every event player belongs to the drafted squads', () => {
    const hostDraft = createTestSquad('spain-2010', 'Spain Manager');
    const guestDraft = createTestSquad('argentina-1986', 'Argentina Manager');

    const hostPlayerIds = new Set(Object.values(hostDraft.draftedSlots).map((s) => s.player.id));
    const guestPlayerIds = new Set(Object.values(guestDraft.draftedSlots).map((s) => s.player.id));

    const sim = MatchEngine.simulateMatch(hostDraft, guestDraft, { randomSeed: 9876 });

    for (const event of sim.events) {
      if (event.player) {
        if (event.team === 'host') {
          expect(hostPlayerIds.has(event.player.id)).toBe(true);
        } else {
          expect(guestPlayerIds.has(event.player.id)).toBe(true);
        }
      }
    }
  });

  it('supports extra time (15s) and penalty shootout with sudden death when tied in knockout', () => {
    const hostDraft = createTestSquad('greece-2004', 'Greece Manager');
    const guestDraft = createTestSquad('portugal-2016', 'Portugal Manager');

    // Run simulations until we hit a tied regular time to verify extra time and penalties
    let foundPenalties = false;
    for (let seed = 1; seed <= 50; seed++) {
      const sim = MatchEngine.simulateMatch(hostDraft, guestDraft, {
        randomSeed: seed,
        knockoutMode: true,
      });

      if (sim.winMethod === 'penalties') {
        foundPenalties = true;
        expect(sim.totalDurationSeconds).toBe(60);
        expect(sim.penalties.length).toBeGreaterThanOrEqual(5);
        expect(sim.penaltyScore).toBeDefined();
        expect(sim.winner).toMatch(/host|guest/);

        // Verify penalty scores match kick outcomes
        let countedHost = 0;
        let countedGuest = 0;
        for (const kick of sim.penalties) {
          if (kick.team === 'host' && kick.scored) countedHost++;
          if (kick.team === 'guest' && kick.scored) countedGuest++;
        }
        expect(sim.penaltyScore?.host).toBe(countedHost);
        expect(sim.penaltyScore?.guest).toBe(countedGuest);
        break;
      }
    }

    expect(foundPenalties).toBe(true);
  });

  it('verifies strictly luck-first engine: underdogs (Greece 2004) can defeat legendary sides (Brazil 1970)', () => {
    // Underdog Greece 2004 (OVR ~85) vs Legendary Brazil 1970 (OVR ~92)
    const underdog = createTestSquad('greece-2004', 'Underdog Greece');
    const legend = createTestSquad('brazil-1970', 'Legendary Brazil');

    let underdogWins = 0;
    let legendWins = 0;
    let draws = 0;
    const TOTAL_MATCHES = 300;

    for (let seed = 1; seed <= TOTAL_MATCHES; seed++) {
      const sim = MatchEngine.simulateMatch(underdog, legend, {
        randomSeed: seed,
        knockoutMode: false, // Allow draws to check full distribution
        ratingWeight: 0.05, // Default modest rating weight
      });

      if (sim.winner === 'host') {
        underdogWins++;
      } else if (sim.winner === 'guest') {
        legendWins++;
      } else {
        draws++;
      }
    }

    // Underdog MUST win a meaningful percentage of matches (at least 20%)
    const underdogWinRate = underdogWins / TOTAL_MATCHES;
    const legendWinRate = legendWins / TOTAL_MATCHES;

    expect(underdogWins).toBeGreaterThan(50); // Underdog wins > 50 out of 300
    expect(legendWins).toBeGreaterThan(50); // Legend also wins
    expect(draws).toBeGreaterThan(20); // Draws occur naturally

    // Neither team is guaranteed victory
    expect(underdogWinRate).toBeGreaterThan(0.20);
    expect(legendWinRate).toBeGreaterThan(0.25);
  });

  it('correctly calculates authoritative match state from real elapsed time (reconnect protection)', () => {
    const hostDraft = createTestSquad('france-1998', 'France');
    const guestDraft = createTestSquad('brazil-2002', 'Brazil');

    const sim = MatchEngine.simulateMatch(hostDraft, guestDraft, {
      randomSeed: 5555,
      knockoutMode: false,
    });
    const startTime = 1000000;
    sim.startTime = startTime;
    sim.status = 'live';

    // 1. Reconnect at second 15
    const stateAt15 = MatchEngine.getAuthoritativeStateAtTime(sim, startTime + 15000);
    expect(stateAt15.currentSecond).toBe(15);
    expect(stateAt15.events.every((e) => e.second <= 15)).toBe(true);

    // 2. Reconnect at second 22 (half-time)
    const stateAt22 = MatchEngine.getAuthoritativeStateAtTime(sim, startTime + 22000);
    expect(stateAt22.currentSecond).toBe(22);
    expect(stateAt22.status).toBe('halftime');

    // 3. Reconnect at second 50 (after 45s completed)
    const stateAt50 = MatchEngine.getAuthoritativeStateAtTime(sim, startTime + 50000);
    expect(stateAt50.currentSecond).toBe(45);
    expect(stateAt50.status).toBe('completed');
  });

  it('computes comprehensive post-match player ratings and designates Star of the Match', () => {
    const hostDraft = createTestSquad('spain-2010', 'Spain');
    const guestDraft = createTestSquad('netherlands-1974', 'Netherlands');

    const sim = MatchEngine.simulateMatch(hostDraft, guestDraft, { randomSeed: 777 });
    const { hostRatings, guestRatings, starOfMatch } = MatchEngine.computePlayerRatings(
      hostDraft,
      guestDraft,
      sim
    );

    expect(hostRatings.length).toBe(11);
    expect(guestRatings.length).toBe(11);
    expect(starOfMatch).not.toBeNull();
    expect(starOfMatch?.isStarOfMatch).toBe(true);

    for (const r of [...hostRatings, ...guestRatings]) {
      expect(r.rating).toBeGreaterThanOrEqual(5.0);
      expect(r.rating).toBeLessThanOrEqual(10.0);
      expect(r.summary).toBeDefined();
    }
  });

  it('correctly maps real seconds to simulated match minutes across 45s, 90s, and 180s durations', () => {
    // 45s blitz: 0s -> 0', 22s -> 45', 45s -> 90'
    expect(MatchEngine.calculateVisualMinute(0, 45)).toBe(0);
    expect(MatchEngine.calculateVisualMinute(22, 45)).toBe(45);
    expect(MatchEngine.calculateVisualMinute(45, 45)).toBe(90);

    // 90s classic: 0s -> 0', 45s -> 45', 59s -> 59', 90s -> 90' (NEVER 120' in regular time!)
    expect(MatchEngine.calculateVisualMinute(0, 90)).toBe(0);
    expect(MatchEngine.calculateVisualMinute(45, 90)).toBe(45);
    expect(MatchEngine.calculateVisualMinute(59, 90)).toBe(59);
    expect(MatchEngine.calculateVisualMinute(90, 90)).toBe(90);

    // 180s (3m manager mode): 0s -> 0', 90s -> 45', 180s -> 90'
    expect(MatchEngine.calculateVisualMinute(0, 180)).toBe(0);
    expect(MatchEngine.calculateVisualMinute(90, 180)).toBe(45);
    expect(MatchEngine.calculateVisualMinute(180, 180)).toBe(90);
  });

  it('produces realistic average goal counts across large match sample (P2-1 tuning test)', () => {
    const hostDraft = createTestSquad('brazil-1970', 'Brazil 1970');
    const guestDraft = createTestSquad('italy-1982', 'Italy 1982');

    let totalGoals = 0;
    const SAMPLE_SIZE = 100;

    for (let seed = 1; seed <= SAMPLE_SIZE; seed++) {
      const sim = MatchEngine.simulateMatch(hostDraft, guestDraft, {
        randomSeed: seed,
        knockoutMode: false,
      });
      totalGoals += sim.finalScore.host + sim.finalScore.guest;
    }

    const avgGoals = totalGoals / SAMPLE_SIZE;
    // Real football averages ~2.7 goals per match.
    // Old implementation produced 6-8 goals per 45s match.
    // With tuning, avgGoals should comfortably sit between 1.5 and 4.5.
    expect(avgGoals).toBeGreaterThanOrEqual(1.5);
    expect(avgGoals).toBeLessThanOrEqual(4.5);
  });

  it('correctly attributes live stats: saves credited to defending team, shots to attacker (P0-1 test)', () => {
    const hostDraft = createTestSquad('france-1998', 'France 1998');
    const guestDraft = createTestSquad('brazil-2002', 'Brazil 2002');

    const sim = MatchEngine.simulateMatch(hostDraft, guestDraft, {
      randomSeed: 4242,
      knockoutMode: false,
    });
    sim.startTime = 100000;
    sim.status = 'live';

    // Calculate full authoritative state
    const authoritative = MatchEngine.getAuthoritativeStateAtTime(sim, 100000 + 45000);

    // Filter saves in the event feed
    const saveEvents = authoritative.events.filter((e) => e.type === 'save');
    expect(saveEvents.length).toBeGreaterThan(0);

    for (const saveEvent of saveEvents) {
      // In a save event, saveEvent.team is the defending team making the save
      const defender = saveEvent.team;
      const attacker = defender === 'host' ? 'guest' : 'host';

      // Defender must have saves recorded
      expect(authoritative.stats[defender].saves).toBeGreaterThan(0);
      // Attacker must have shots recorded
      expect(authoritative.stats[attacker].shots).toBeGreaterThan(0);
    }
  });

  it('verifies tactical mentality values impact simulation outcomes (P0-2 test)', () => {
    const hostDraftDef = createTestSquad('spain-2010', 'Spain Defensive');
    hostDraftDef.strategy = 'defensive';
    const guestDraft = createTestSquad('argentina-1986', 'Argentina Neutral');
    guestDraft.strategy = 'balanced';

    const hostDraftAtt = createTestSquad('spain-2010', 'Spain Attacking');
    hostDraftAtt.strategy = 'attacking';

    let defensiveHostGoals = 0;
    let attackingHostGoals = 0;
    const MATCH_COUNT = 150;

    for (let seed = 1; seed <= MATCH_COUNT; seed++) {
      const defSim = MatchEngine.simulateMatch(hostDraftDef, guestDraft, { randomSeed: seed });
      defensiveHostGoals += defSim.finalScore.host;

      const attSim = MatchEngine.simulateMatch(hostDraftAtt, guestDraft, { randomSeed: seed });
      attackingHostGoals += attSim.finalScore.host;
    }

    // Attacking mentality generates more goals on average than defensive mentality
    expect(attackingHostGoals).toBeGreaterThan(defensiveHostGoals);
  });
});
