import { describe, it, expect } from 'vitest';
import { TournamentEngine } from '../src/shared/engine/tournamentEngine.js';
import { offlineSoloEngine } from '../src/client/services/offlineSoloEngine.js';

describe('TournamentEngine (7-Game World Cup Event Campaign)', () => {
  it('creates an 8-group World Cup tournament with exactly 32 teams', () => {
    const editions = offlineSoloEngine.getEditions();
    const players = offlineSoloEngine.getPlayers();

    const tourney = TournamentEngine.createTournament({
      poolType: 'national',
      draftMode: 'campaign',
      matchDurationSec: 180,
      userName: 'Farhan XI',
      editions,
      players,
    });

    expect(tourney.groups.length).toBe(8); // Groups A - H
    expect(tourney.groups[0].teams.length).toBe(4);
    expect(tourney.groups[0].teams[0].isUser).toBe(true);
    expect(tourney.currentRound).toBe('group_match_1');
    expect(tourney.matchDurationSec).toBe(180);

    const userMatch1 = TournamentEngine.getCurrentUserMatch(tourney);
    expect(userMatch1).toBeDefined();
    expect(userMatch1?.isUserMatch).toBe(true);
  });

  it('progresses through 3 group matches and advances user to Round of 16 upon qualification', () => {
    const editions = offlineSoloEngine.getEditions();
    const players = offlineSoloEngine.getPlayers();

    const tourney = TournamentEngine.createTournament({
      poolType: 'national',
      draftMode: 'campaign',
      userName: 'Champion Boss',
      editions,
      players,
    });

    // Match 1: User wins 3-0
    TournamentEngine.advanceTournament(tourney, { userScore: 3, opponentScore: 0 }, players);
    expect(tourney.currentRound).toBe('group_match_2');

    // Match 2: User wins 2-1
    TournamentEngine.advanceTournament(tourney, { userScore: 2, opponentScore: 1 }, players);
    expect(tourney.currentRound).toBe('group_match_3');

    // Match 3: User wins 2-0 (9 points, top of group!)
    TournamentEngine.advanceTournament(tourney, { userScore: 2, opponentScore: 0 }, players);
    expect(tourney.isEliminated).toBe(false);
    expect(tourney.currentRound).toBe('round_of_16');
    expect(tourney.knockoutFixtures.roundOf16.length).toBe(8);

    const r16UserMatch = TournamentEngine.getCurrentUserMatch(tourney);
    expect(r16UserMatch).toBeDefined();
    expect(r16UserMatch?.isUserMatch).toBe(true);
  });

  it('runs complete 7-game campaign from Round of 16 to World Cup Champion', () => {
    const editions = offlineSoloEngine.getEditions();
    const players = offlineSoloEngine.getPlayers();

    const tourney = TournamentEngine.createTournament({
      poolType: 'national',
      draftMode: 'campaign',
      userName: 'World Champ',
      editions,
      players,
    });

    // 3 Group Matches (Wins)
    TournamentEngine.advanceTournament(tourney, { userScore: 2, opponentScore: 0 }, players);
    TournamentEngine.advanceTournament(tourney, { userScore: 3, opponentScore: 1 }, players);
    TournamentEngine.advanceTournament(tourney, { userScore: 1, opponentScore: 0 }, players);
    expect(tourney.currentRound).toBe('round_of_16');

    // Game 4: Round of 16 (Win 2-1)
    TournamentEngine.advanceTournament(tourney, { userScore: 2, opponentScore: 1 }, players);
    expect(tourney.currentRound).toBe('quarter_finals');
    expect(tourney.knockoutFixtures.quarterFinals.length).toBe(4);

    // Game 5: Quarter-Finals (Win 1-0)
    TournamentEngine.advanceTournament(tourney, { userScore: 1, opponentScore: 0 }, players);
    expect(tourney.currentRound).toBe('semi_finals');
    expect(tourney.knockoutFixtures.semiFinals.length).toBe(2);

    // Game 6: Semi-Finals (Win 3-2)
    TournamentEngine.advanceTournament(tourney, { userScore: 3, opponentScore: 2 }, players);
    expect(tourney.currentRound).toBe('final');
    expect(tourney.knockoutFixtures.final).toBeDefined();

    // Game 7: World Cup Grand Final (Win 2-1)
    TournamentEngine.advanceTournament(tourney, { userScore: 2, opponentScore: 1 }, players);
    expect(tourney.currentRound).toBe('completed');
    expect(tourney.champion?.isUser).toBe(true);
    expect(tourney.champion?.name).toBe('World Champ');
    expect(tourney.isEliminated).toBe(false);
  });

  it('marks tournament eliminated with NO champion or runner-up when user finishes last in group', () => {
    const editions = offlineSoloEngine.getEditions();
    const players = offlineSoloEngine.getPlayers();

    const tourney = TournamentEngine.createTournament({
      poolType: 'national',
      draftMode: 'campaign',
      userName: 'Unlucky XI',
      editions,
      players,
    });

    // Match 1: User loses 0-3
    TournamentEngine.advanceTournament(tourney, { userScore: 0, opponentScore: 3 }, players);
    // Match 2: User loses 1-4
    TournamentEngine.advanceTournament(tourney, { userScore: 1, opponentScore: 4 }, players);
    // Match 3: User loses 0-2 (Dead last with 0 points)
    TournamentEngine.advanceTournament(tourney, { userScore: 0, opponentScore: 2 }, players);

    expect(tourney.isEliminated).toBe(true);
    expect(tourney.currentRound).toBe('completed');
    expect(tourney.champion).toBeUndefined();
    expect(tourney.runnerUp).toBeUndefined(); // Strictly no runner-up!
  });

  it('correctly sets runnerUp to user when user loses the Grand Final', () => {
    const editions = offlineSoloEngine.getEditions();
    const players = offlineSoloEngine.getPlayers();

    const tourney = TournamentEngine.createTournament({
      poolType: 'national',
      draftMode: 'campaign',
      userName: 'Silver Finalist',
      editions,
      players,
    });

    // 3 Group Wins
    TournamentEngine.advanceTournament(tourney, { userScore: 2, opponentScore: 0 }, players);
    TournamentEngine.advanceTournament(tourney, { userScore: 3, opponentScore: 1 }, players);
    TournamentEngine.advanceTournament(tourney, { userScore: 1, opponentScore: 0 }, players);
    // R16 Win
    TournamentEngine.advanceTournament(tourney, { userScore: 2, opponentScore: 1 }, players);
    // QF Win
    TournamentEngine.advanceTournament(tourney, { userScore: 1, opponentScore: 0 }, players);
    // SF Win
    TournamentEngine.advanceTournament(tourney, { userScore: 3, opponentScore: 2 }, players);
    expect(tourney.currentRound).toBe('final');

    // Grand Final: User loses 1-2
    TournamentEngine.advanceTournament(tourney, { userScore: 1, opponentScore: 2 }, players);
    expect(tourney.currentRound).toBe('completed');
    expect(tourney.champion?.isUser).toBe(false);
    expect(tourney.runnerUp?.isUser).toBe(true);
    expect(tourney.runnerUp?.name).toBe('Silver Finalist');
  });

  it('builds authentic AI opponent squad from the team edition roster and preserves userSquad', () => {
    const editions = offlineSoloEngine.getEditions();
    const players = offlineSoloEngine.getPlayers();

    const tourney = TournamentEngine.createTournament({
      poolType: 'national',
      draftMode: 'pack_roll',
      userName: 'Tactical Master',
      editions,
      players,
    });

    // Check opponent team
    const opponentTeam = tourney.groups[0].teams.find((t) => !t.isUser)!;
    const aiDraft = TournamentEngine.buildAiTeamSquad(opponentTeam, tourney.poolType, players, opponentTeam.formationId);

    expect(aiDraft.isReady).toBe(true);
    const draftedList = Object.values(aiDraft.draftedSlots);
    expect(draftedList.length).toBe(11);
    // Verify each drafted player belongs to the opponent's historical team edition
    const opponentEditionPlayers = players.filter((p) => p.editionId === opponentTeam.editionId);
    expect(opponentEditionPlayers.length).toBeGreaterThanOrEqual(11);
    for (const slot of draftedList) {
      expect(slot.player.editionId).toBe(opponentTeam.editionId);
    }

    // Set userSquad on tournament and verify advanceTournament preserves it
    tourney.userSquad = aiDraft; // mock user squad
    TournamentEngine.advanceTournament(tourney, { userScore: 3, opponentScore: 1 }, players);
    expect(tourney.userSquad).toBeDefined();
    expect(tourney.userSquad?.isReady).toBe(true);
    expect(Object.keys(tourney.userSquad?.draftedSlots || {}).length).toBe(11);
  });

  it('accurately tracks player goals and assists for all teams in auto-simulation and generates tournament awards', () => {
    const editions = offlineSoloEngine.getEditions();
    const players = offlineSoloEngine.getPlayers();

    const tourney = TournamentEngine.createTournament({
      poolType: 'national',
      draftMode: 'campaign',
      userName: 'Legends XI',
      editions,
      players,
    });

    // Advance 3 group matches with mock simulation events for user match
    const mockSimulation1: any = {
      durationSec: 90,
      score: { host: 2, guest: 0 },
      events: [
        {
          type: 'goal',
          second: 24,
          minute: 24,
          period: 'first_half',
          team: 'host',
          player: { id: 'user-pel-10', name: 'Pelé', position: 'ST', squadNumber: 10 },
          secondaryPlayer: { id: 'user-gar-7', name: 'Garrincha', position: 'RW', squadNumber: 7 },
        },
        {
          type: 'goal',
          second: 68,
          minute: 68,
          period: 'second_half',
          team: 'host',
          player: { id: 'user-pel-10', name: 'Pelé', position: 'ST', squadNumber: 10 },
          secondaryPlayer: { id: 'user-did-8', name: 'Didi', position: 'CM', squadNumber: 8 },
        },
      ],
    };

    TournamentEngine.advanceTournament(
      tourney,
      { userScore: 2, opponentScore: 0, simulation: mockSimulation1 },
      players
    );

    // Verify stats were tracked after Match 1
    expect(tourney.playerStats).toBeDefined();
    const peleStat = tourney.playerStats!['user-pel-10'];
    expect(peleStat).toBeDefined();
    expect(peleStat.goals).toBe(2);
    expect(peleStat.isUserPlayer).toBe(true);

    const garrinchaStat = tourney.playerStats!['user-gar-7'];
    expect(garrinchaStat).toBeDefined();
    expect(garrinchaStat.assists).toBe(1);

    // Verify auto-simulated AI matches in Round 1 also recorded goals & player stats
    const aiFinishedFixtures = tourney.groupFixtures.filter(
      (f) => f.round === 'group_match_1' && !f.isUserMatch && f.status === 'finished'
    );
    expect(aiFinishedFixtures.length).toBeGreaterThan(0);
    for (const aiMatch of aiFinishedFixtures) {
      const totalGoals = (aiMatch.homeScore ?? 0) + (aiMatch.awayScore ?? 0);
      expect(aiMatch.goals?.length).toBe(totalGoals);
    }

    // Play remaining matches to win the World Cup
    TournamentEngine.advanceTournament(tourney, { userScore: 2, opponentScore: 1 }, players);
    TournamentEngine.advanceTournament(tourney, { userScore: 1, opponentScore: 0 }, players);
    TournamentEngine.advanceTournament(tourney, { userScore: 3, opponentScore: 1 }, players);
    TournamentEngine.advanceTournament(tourney, { userScore: 2, opponentScore: 0 }, players);
    TournamentEngine.advanceTournament(tourney, { userScore: 1, opponentScore: 0 }, players);
    TournamentEngine.advanceTournament(tourney, { userScore: 2, opponentScore: 1 }, players);

    expect(tourney.currentRound).toBe('completed');
    expect(tourney.champion?.name).toBe('Legends XI');

    // Verify tournament awards were computed
    expect(tourney.awards).toBeDefined();
    expect(tourney.awards?.championTeam).toBe('Legends XI');
    expect(tourney.awards?.goldenBoot).toBeDefined();
    expect(tourney.awards?.goldenBoot?.goals).toBeGreaterThanOrEqual(2);
    expect(tourney.awards?.topPlaymaker).toBeDefined();
    expect(tourney.awards?.topPlaymaker?.assists).toBeGreaterThanOrEqual(1);
    expect(tourney.awards?.mvp).toBeDefined();
  });

  it('preserves drafted user squad across tournament rounds without requiring re-drafting', () => {
    const editions = offlineSoloEngine.getEditions();
    const players = offlineSoloEngine.getPlayers();

    const tourney = TournamentEngine.createTournament({
      poolType: 'national',
      draftMode: 'pack_roll',
      userName: 'Tactical Masters',
      editions,
      players,
    });

    const mockSquad: any = {
      seatId: 'host',
      playerId: 'user-manager',
      playerName: 'Tactical Masters',
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

    tourney.userSquad = mockSquad;

    // Advance Game 1 (win 3-1)
    const updated1 = TournamentEngine.advanceTournament(tourney, { userScore: 3, opponentScore: 1 }, players);
    expect(updated1.currentRound).toBe('group_match_2');
    expect(updated1.userSquad).toBeDefined();
    expect(updated1.userSquad?.isReady).toBe(true);
    expect(Object.keys(updated1.userSquad?.draftedSlots || {}).length).toBe(11);

    // Verify next match for Round 2 is ready
    const userMatch2 = TournamentEngine.getCurrentUserMatch(updated1);
    expect(userMatch2).toBeDefined();
    expect(userMatch2?.isUserMatch).toBe(true);
    expect(userMatch2?.round).toBe('group_match_2');

    // Advance Game 2 (win 2-0)
    const updated2 = TournamentEngine.advanceTournament(updated1, { userScore: 2, opponentScore: 0 }, players);
    expect(updated2.currentRound).toBe('group_match_3');
    expect(updated2.userSquad).toBeDefined();
    expect(updated2.userSquad?.isReady).toBe(true);
  });
});

