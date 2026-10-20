import { describe, it, expect, beforeEach } from 'vitest';
import { profileService } from '../src/client/services/profileService.js';
import { getEditionCaliber } from '../src/client/utils/dreamTeamHelper.js';
import { offlineSoloEngine } from '../src/client/services/offlineSoloEngine.js';
import { SavedDreamTeam, PlayerVersion } from '../src/shared/types/index.js';
import { FORMATIONS, isPlayerEligibleForSlot } from '../src/shared/constants/formations.js';
import { DREAM_TEAM_BENCH_SLOTS } from '../src/client/components/DreamTeamBuilderModal.js';

describe('Profile Dream Team & Stats Tracking', () => {
  beforeEach(() => {
    // Clear localStorage mockup
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  it('saves Dream Team directly in profile and initializes stats', () => {
    const mockDreamTeam: SavedDreamTeam = {
      name: 'Galacticos XI',
      formationId: '4-3-3',
      totalOvr: 92,
      savedAt: Date.now(),
      draftedSlots: {
        'slot-st': {
          slotId: 'slot-st',
          assignedPosition: 'ST',
          player: {
            id: 'p-pele',
            identityId: 'pele',
            name: 'Pelé',
            ovr: 98,
            naturalPositions: ['ST'],
            editionId: 'ed-bra-1970',
            squadNumber: 10,
            stats: { pace: 95, shooting: 97, passing: 93, dribbling: 96, defending: 55, physical: 86 },
          } as unknown as PlayerVersion,
        },
      },
    };

    profileService.saveDreamTeam(mockDreamTeam);
    const saved = profileService.getDreamTeam();

    expect(saved).not.toBeNull();
    expect(saved?.name).toBe('Galacticos XI');
    expect(saved?.playerStats).toBeDefined();
    expect(saved?.playerStats?.['pele']).toBeDefined();
    expect(saved?.playerStats?.['pele'].appearances).toBe(0);
    expect(saved?.playerStats?.['pele'].goals).toBe(0);
    expect(saved?.teamStats?.matchesPlayed).toBe(0);
  });

  it('records Dream Team match and accumulates goals, assists, MOTM, ratings, and clean sheets', () => {
    const mockDreamTeam: SavedDreamTeam = {
      name: 'Legends XI',
      formationId: '4-3-3',
      totalOvr: 90,
      savedAt: Date.now(),
      draftedSlots: {
        'slot-st': {
          slotId: 'slot-st',
          assignedPosition: 'RW',
          player: {
            id: 'p-messi',
            identityId: 'messi',
            name: 'Lionel Messi',
            ovr: 96,
            naturalPositions: ['RW'],
            editionId: 'ed-arg-2022',
            squadNumber: 10,
            stats: { pace: 90, shooting: 94, passing: 95, dribbling: 97, defending: 40, physical: 72 },
          } as unknown as PlayerVersion,
        },
      },
    };

    profileService.saveDreamTeam(mockDreamTeam);

    // Record Match 1: 3-0 Win
    profileService.recordDreamTeamMatch({
      userScore: 3,
      opponentScore: 0,
      opponentName: 'Brazil 1970',
      playerMatchStats: [
        {
          identityId: 'messi',
          goals: 2,
          assists: 1,
          cleanSheet: true,
          motm: true,
          yellowCard: false,
          redCard: false,
          rating: 9.8,
        },
      ],
    });

    let currentDt = profileService.getDreamTeam();
    expect(currentDt?.teamStats?.matchesPlayed).toBe(1);
    expect(currentDt?.teamStats?.wins).toBe(1);
    expect(currentDt?.teamStats?.goalsFor).toBe(3);
    expect(currentDt?.teamStats?.goalsAgainst).toBe(0);

    let messiStats = currentDt?.playerStats?.['messi'];
    expect(messiStats?.appearances).toBe(1);
    expect(messiStats?.goals).toBe(2);
    expect(messiStats?.assists).toBe(1);
    expect(messiStats?.motmAwards).toBe(1);
    expect(messiStats?.cleanSheets).toBe(1);
    expect(messiStats?.totalRating).toBeCloseTo(9.8);

    // Record Match 2: 1-1 Draw
    profileService.recordDreamTeamMatch({
      userScore: 1,
      opponentScore: 1,
      opponentName: 'Italy 2006',
      playerMatchStats: [
        {
          identityId: 'messi',
          goals: 1,
          assists: 0,
          cleanSheet: false,
          motm: false,
          yellowCard: true,
          redCard: false,
          rating: 7.5,
        },
      ],
    });

    currentDt = profileService.getDreamTeam();
    expect(currentDt?.teamStats?.matchesPlayed).toBe(2);
    expect(currentDt?.teamStats?.wins).toBe(1);
    expect(currentDt?.teamStats?.draws).toBe(1);
    expect(currentDt?.teamStats?.goalsFor).toBe(4);
    expect(currentDt?.teamStats?.goalsAgainst).toBe(1);

    messiStats = currentDt?.playerStats?.['messi'];
    expect(messiStats?.appearances).toBe(2);
    expect(messiStats?.goals).toBe(3);
    expect(messiStats?.assists).toBe(1);
    expect(messiStats?.motmAwards).toBe(1);
    expect(messiStats?.cleanSheets).toBe(1);
    expect(messiStats?.yellowCards).toBe(1);
    expect(messiStats?.totalRating).toBeCloseTo(17.3);
  });

  it('calculates edition caliber accurately for AI opponent matching', () => {
    const players = offlineSoloEngine.getPlayers();
    const editions = offlineSoloEngine.getEditions();

    expect(editions.length).toBeGreaterThan(0);
    const ed = editions[0];
    const caliber = getEditionCaliber(ed, players);

    expect(caliber).toBeGreaterThanOrEqual(70);
    expect(caliber).toBeLessThanOrEqual(99);
  });

  it('safely invokes soundManager.playPickSound without throwing', async () => {
    const { soundManager } = await import('../src/client/utils/audio.js');
    expect(() => soundManager.playPickSound()).not.toThrow();
    expect(() => soundManager.playRerollSound()).not.toThrow();
    expect(() => soundManager.playVictoryFanfare()).not.toThrow();
  });

  it('verifies slot eligibility rules for squad builder assignments', () => {
    const players = offlineSoloEngine.getPlayers();
    const formation433 = FORMATIONS['4-3-3'];

    const gkSlot = formation433.slots.find((s: any) => s.defaultPosition === 'GK');
    expect(gkSlot).toBeDefined();

    const gkCandidates = players.filter((p: any) => isPlayerEligibleForSlot(p, gkSlot));
    expect(gkCandidates.length).toBeGreaterThan(50);
    // Every candidate for GK slot must have GK position
    gkCandidates.forEach((p: any) => {
      const allPos = [...p.naturalPositions, ...(p.secondaryPositions || [])];
      expect(allPos).toContain('GK');
    });

    const stSlot = formation433.slots.find((s: any) => s.defaultPosition === 'ST');
    expect(stSlot).toBeDefined();
    const stCandidates = players.filter((p: any) => isPlayerEligibleForSlot(p, stSlot));
    expect(stCandidates.length).toBeGreaterThan(50);
  });

  it('auto-fills an entire 11-player squad with unique identities and saves to profile', () => {
    const players = offlineSoloEngine.getPlayers();
    const formation = FORMATIONS['4-3-3'];

    const newDrafted: Record<string, any> = {};
    const usedIds: string[] = [];

    for (const slot of formation.slots) {
      const eligible = players.filter(
        (p: any) => !usedIds.includes(p.identityId) && isPlayerEligibleForSlot(p, slot)
      );
      const best = eligible.sort((a: any, b: any) => b.ovr - a.ovr)[0] || players[0];
      newDrafted[slot.id] = {
        slotId: slot.id,
        player: best,
        assignedPosition: slot.defaultPosition,
      };
      usedIds.push(best.identityId);
    }

    expect(Object.keys(newDrafted).length).toBe(11);
    expect(new Set(usedIds).size).toBe(11);

    profileService.saveDreamTeam({
      name: 'Auto Star XI',
      formationId: '4-3-3',
      draftedSlots: newDrafted,
      totalOvr: 93,
      savedAt: Date.now(),
    });

    const saved = profileService.getDreamTeam();
    expect(saved?.name).toBe('Auto Star XI');
    expect(Object.keys(saved?.draftedSlots || {}).length).toBe(11);
  });

  it('validates all 12 historic/modern formation presets are properly registered with 11 slots', () => {
    const formationIds = [
      '4-3-3',
      '4-4-2',
      '4-2-3-1',
      '3-5-2',
      '3-4-3',
      '5-3-2',
      '4-1-2-1-2',
      '4-3-1-2',
      '4-2-2-2',
      '4-3-2-1',
      '4-5-1',
      '3-4-1-2',
    ];

    expect(Object.keys(FORMATIONS).length).toBeGreaterThanOrEqual(12);

    formationIds.forEach((id) => {
      const f = FORMATIONS[id];
      expect(f, `Formation ${id} should exist`).toBeDefined();
      expect(f.slots.length, `Formation ${id} must have exactly 11 slots`).toBe(11);
      // Must contain a GK
      const hasGk = f.slots.some((s) => s.defaultPosition === 'GK');
      expect(hasGk, `Formation ${id} must have a GK`).toBe(true);
    });
  });

  it('creates and saves a full 20-player squad (11 Starters + 9 Subs) with custom tactics and roles', () => {
    const players = offlineSoloEngine.getPlayers();
    const formation = FORMATIONS['4-3-3'];

    const startersMap: Record<string, any> = {};
    const benchMap: Record<string, any> = {};
    const usedIds: string[] = [];

    // 11 Starters
    for (const slot of formation.slots) {
      const eligible = players.filter((p) => !usedIds.includes(p.identityId) && isPlayerEligibleForSlot(p, slot));
      const best = eligible.sort((a, b) => b.ovr - a.ovr)[0] || players[0];
      startersMap[slot.id] = { slotId: slot.id, player: best, assignedPosition: slot.defaultPosition };
      usedIds.push(best.identityId);
    }

    // 9 Subs
    for (const bSlot of DREAM_TEAM_BENCH_SLOTS) {
      const eligible = players.filter((p) => !usedIds.includes(p.identityId));
      const best = eligible.sort((a, b) => b.ovr - a.ovr)[0] || players[0];
      benchMap[bSlot.id] = { slotId: bSlot.id, player: best, assignedPosition: bSlot.defaultPosition };
      usedIds.push(best.identityId);
    }

    expect(Object.keys(startersMap).length).toBe(11);
    expect(Object.keys(benchMap).length).toBe(9);
    expect(new Set(usedIds).size).toBe(20);

    profileService.saveDreamTeam({
      name: 'Galacticos 20 Squad',
      formationId: '4-3-3',
      draftedSlots: startersMap,
      benchSlots: benchMap,
      totalOvr: 93,
      squadOvr: 91,
      tactics: {
        mentality: 'attacking',
        defensiveStyle: 'high_press',
        passingStyle: 'tiki_taka',
      },
      roles: {
        captainSlotId: 'st',
        penaltySlotId: 'st',
        freeKickSlotId: 'lw',
        cornerSlotId: 'rw',
      },
      savedAt: Date.now(),
    });

    const saved = profileService.getDreamTeam();
    expect(saved).not.toBeNull();
    expect(saved?.name).toBe('Galacticos 20 Squad');
    expect(Object.keys(saved?.draftedSlots || {}).length).toBe(11);
    expect(Object.keys(saved?.benchSlots || {}).length).toBe(9);
    expect(saved?.tactics?.mentality).toBe('attacking');
    expect(saved?.roles?.captainSlotId).toBe('st');

    // Verify all 20 players have initialized stats
    expect(Object.keys(saved?.playerStats || {}).length).toBe(20);
  });
});

