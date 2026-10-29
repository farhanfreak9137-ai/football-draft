import { describe, it, expect } from 'vitest';
import { TournamentEngine } from '../src/shared/engine/tournamentEngine.js';
import { tournamentService } from '../src/client/services/tournamentService.js';
import { offlineSoloEngine } from '../src/client/services/offlineSoloEngine.js';
import { profileService } from '../src/client/services/profileService.js';

describe('World Cup 7-Match Campaign End-to-End Workflow', () => {
  it('runs complete 7-match campaign without forcing drafting between rounds', () => {
    const players = offlineSoloEngine.getPlayers();
    expect(players.length).toBeGreaterThan(100);

    // 1. Start Tournament
    const tourney = tournamentService.startTournament({
      name: '2026 World Cup Gauntlet',
      poolType: 'national',
      draftMode: 'pack_roll',
      matchDurationSec: 180,
      userName: 'Tactical Legends',
      userFormationId: '4-3-3',
    });

    expect(tourney.name).toBe('2026 World Cup Gauntlet');
    expect(tourney.groups.length).toBe(8);
    expect(tourney.currentRound).toBe('group_match_1');
    expect(tourney.isEliminated).toBe(false);

    // 2. Draft manager squad once for Game 1
    const mockSquad: any = {
      seatId: 'host',
      playerId: 'user-manager',
      playerName: 'Tactical Legends',
      poolType: 'national',
      isReady: true,
      draftedSlots: {
        'slot-0': { slotId: 'slot-0', player: players[0], assignedPosition: 'GK' },
        'slot-1': { slotId: 'slot-1', player: players[1], assignedPosition: 'CB' },
        'slot-2': { slotId: 'slot-2', player: players[2], assignedPosition: 'CB' },
        'slot-3': { slotId: 'slot-3', player: players[3], assignedPosition: 'LB' },
        'slot-4': { slotId: 'slot-4', player: players[4], assignedPosition: 'RB' },
        'slot-5': { slotId: 'slot-5', player: players[5], assignedPosition: 'CM' },
        'slot-6': { slotId: 'slot-6', player: players[6], assignedPosition: 'CM' },
        'slot-7': { slotId: 'slot-7', player: players[7], assignedPosition: 'CM' },
        'slot-8': { slotId: 'slot-8', player: players[8], assignedPosition: 'LW' },
        'slot-9': { slotId: 'slot-9', player: players[9], assignedPosition: 'RW' },
        'slot-10': { slotId: 'slot-10', player: players[10], assignedPosition: 'ST' },
      },
      usedIdentityIds: players.slice(0, 11).map((p) => p.identityId),
    };

    tournamentService.setUserSquad(mockSquad);
    const savedTourney = tournamentService.getActiveTournament();
    expect(savedTourney?.userSquad).toBeDefined();
    expect(savedTourney?.userSquad?.isReady).toBe(true);

    // 3. Play Game 1 (Group Match 1)
    const match1 = tournamentService.getCurrentUserMatch();
    expect(match1).toBeDefined();
    expect(match1?.round).toBe('group_match_1');

    const updatedAfterGame1 = tournamentService.recordUserMatchResult({
      userScore: 3,
      opponentScore: 1,
    });

    expect(updatedAfterGame1.currentRound).toBe('group_match_2');
    expect(updatedAfterGame1.userSquad).toBeDefined();
    expect(updatedAfterGame1.userSquad?.isReady).toBe(true);
    expect(Object.keys(updatedAfterGame1.userSquad?.draftedSlots || {}).length).toBe(11);

    // 4. Verify Game 2 is ready without re-drafting
    const match2 = tournamentService.getCurrentUserMatch();
    expect(match2).toBeDefined();
    expect(match2?.round).toBe('group_match_2');
    expect(match2?.homeTeam.isUser || match2?.awayTeam.isUser).toBe(true);

    // Play Game 2 (Group Match 2: Win 2-0)
    const updatedAfterGame2 = tournamentService.recordUserMatchResult({
      userScore: 2,
      opponentScore: 0,
    });
    expect(updatedAfterGame2.currentRound).toBe('group_match_3');
    expect(updatedAfterGame2.userSquad).toBeDefined();

    // Play Game 3 (Group Match 3: Win 1-0 -> 9 pts, advances to Round of 16!)
    const updatedAfterGame3 = tournamentService.recordUserMatchResult({
      userScore: 1,
      opponentScore: 0,
    });
    expect(updatedAfterGame3.currentRound).toBe('round_of_16');
    expect(updatedAfterGame3.isEliminated).toBe(false);
    expect(updatedAfterGame3.userSquad).toBeDefined();
    expect(updatedAfterGame3.knockoutFixtures.roundOf16.length).toBe(8);

    // 5. Play Round of 16 (Game 4: Win 2-1)
    const updatedAfterGame4 = tournamentService.recordUserMatchResult({
      userScore: 2,
      opponentScore: 1,
    });
    expect(updatedAfterGame4.currentRound).toBe('quarter_finals');
    expect(updatedAfterGame4.userSquad).toBeDefined();

    // 6. Play Quarter-Finals (Game 5: Win 2-2, 5-4 on penalties!)
    const updatedAfterGame5 = tournamentService.recordUserMatchResult({
      userScore: 2,
      opponentScore: 2,
      penaltyScore: { user: 5, opponent: 4 },
    });
    expect(updatedAfterGame5.currentRound).toBe('semi_finals');
    expect(updatedAfterGame5.userSquad).toBeDefined();

    // 7. Play Semi-Finals (Game 6: Win 3-1)
    const updatedAfterGame6 = tournamentService.recordUserMatchResult({
      userScore: 3,
      opponentScore: 1,
    });
    expect(updatedAfterGame6.currentRound).toBe('final');
    expect(updatedAfterGame6.userSquad).toBeDefined();

    // 8. Play World Cup Grand Final (Game 7: Win 2-0)
    const championTourney = tournamentService.recordUserMatchResult({
      userScore: 2,
      opponentScore: 0,
    });
    expect(championTourney.currentRound).toBe('completed');
    expect(championTourney.champion?.isUser).toBe(true);
    expect(championTourney.champion?.name).toBe('Tactical Legends');
    expect(championTourney.awards).toBeDefined();
    expect(championTourney.awards?.championTeam).toBe('Tactical Legends');

    // 9. Verify Manager Profile received tournament record
    const profile = profileService.getProfile();
    expect(profile.stats.tournamentsPlayed).toBeGreaterThanOrEqual(1);
    expect(profile.stats.trophiesWon).toBeGreaterThanOrEqual(1);
    expect(profile.trophies.length).toBeGreaterThanOrEqual(1);
    const latestTrophy = profile.trophies[0];
    expect(latestTrophy.type).toBe('gold');
    expect(latestTrophy.tournamentName).toBe('2026 World Cup Gauntlet');
  });
});
