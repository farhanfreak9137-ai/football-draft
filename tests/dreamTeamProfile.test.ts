import { describe, it, expect, beforeEach } from 'vitest';
import { profileService } from '../src/client/services/profileService.js';
import { getEditionCaliber } from '../src/client/utils/dreamTeamHelper.js';
import { offlineSoloEngine } from '../src/client/services/offlineSoloEngine.js';
import { SavedDreamTeam, PlayerVersion } from '../src/shared/types/index.js';

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
          player: {
            id: 'p-pele',
            identityId: 'pele',
            name: 'Pelé',
            ovr: 98,
            naturalPositions: ['ST'],
            editionId: 'ed-bra-1970',
            squadNumber: 10,
            stats: { pace: 95, shooting: 97, passing: 93, dribbling: 96, defending: 55, physical: 86 },
          } as PlayerVersion,
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
          player: {
            id: 'p-messi',
            identityId: 'messi',
            name: 'Lionel Messi',
            ovr: 96,
            naturalPositions: ['RW'],
            editionId: 'ed-arg-2022',
            squadNumber: 10,
            stats: { pace: 90, shooting: 94, passing: 95, dribbling: 97, defending: 40, physical: 72 },
          } as PlayerVersion,
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
});

