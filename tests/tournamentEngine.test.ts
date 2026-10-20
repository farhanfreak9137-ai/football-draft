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
});

