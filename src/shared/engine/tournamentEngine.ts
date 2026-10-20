import {
  FormationDefinition,
  MatchSimulationState,
  PlayerDraftState,
  PlayerVersion,
  PoolType,
  TeamEdition,
  TournamentDraftMode,
  TournamentGroup,
  TournamentMatchFixture,
  TournamentRound,
  TournamentState,
  TournamentTeam,
} from '../types/index.js';
import { FORMATIONS } from '../constants/formations.js';
import { PRNG } from './prng.js';
import { DraftEngine } from './draftEngine.js';
import { MatchEngine } from './matchEngine.js';

export class TournamentEngine {
  /**
   * Initializes a full 32-team, 8-group World Cup style tournament.
   * Total user path to championship is exactly 7 games:
   * 3 Group Matches -> Round of 16 -> Quarter-Finals -> Semi-Finals -> Final!
   */
  static createTournament(params: {
    name?: string;
    poolType: PoolType;
    draftMode: TournamentDraftMode;
    matchDurationSec?: number;
    userName?: string;
    userFormationId?: string;
    userCustomFormation?: FormationDefinition;
    editions: TeamEdition[];
    players: PlayerVersion[];
    seed?: number;
  }): TournamentState {
    const prng = new PRNG(params.seed ?? Date.now());
    const poolEditions = params.editions.filter((e) => e.editionType === params.poolType);
    const candidateEditions = poolEditions.length >= 32 ? poolEditions : params.editions;

    // Pick 32 unique teams
    const shuffled = prng.shuffle([...candidateEditions]);
    const selected32 = shuffled.slice(0, 32);

    const userTeam: TournamentTeam = {
      id: 'team-user',
      name: params.userName?.trim() || 'My Dream XI',
      editionId: selected32[0].id,
      poolType: params.poolType,
      isUser: true,
      formationId: params.userFormationId || '4-3-3',
      groupStats: {
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      },
    };

    const aiTeams: TournamentTeam[] = selected32.slice(1).map((ed, idx) => ({
      id: `team-ai-${idx + 1}`,
      name: `${ed.teamName} (${ed.yearOrSeason})`,
      editionId: ed.id,
      poolType: ed.editionType,
      isUser: false,
      formationId: ed.tacticalFormation || '4-3-3',
      groupStats: {
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      },
    }));

    // Group letters A through H (8 groups of 4 teams each)
    const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const groups: TournamentGroup[] = [];

    // User is in Group A along with 3 AI teams
    const groupATeams = [userTeam, aiTeams[0], aiTeams[1], aiTeams[2]];
    groups.push({
      id: 'A',
      name: 'Group A',
      teams: groupATeams,
    });

    // Groups B through H get 4 AI teams each
    let aiIndex = 3;
    for (let i = 1; i < 8; i++) {
      const letter = groupLetters[i];
      const gTeams = [
        aiTeams[aiIndex++],
        aiTeams[aiIndex++],
        aiTeams[aiIndex++],
        aiTeams[aiIndex++],
      ];
      groups.push({
        id: letter,
        name: `Group ${letter}`,
        teams: gTeams,
      });
    }

    // Generate Group Stage Match Fixtures (Matchdays 1, 2, and 3)
    const groupFixtures: TournamentMatchFixture[] = [];
    for (const group of groups) {
      const [t1, t2, t3, t4] = group.teams;
      // Matchday 1: t1 vs t2, t3 vs t4
      groupFixtures.push({
        id: `m-grp-${group.id}-1-1`,
        round: 'group_match_1',
        groupLetter: group.id,
        homeTeam: t1,
        awayTeam: t2,
        status: 'scheduled',
        isUserMatch: t1.isUser || t2.isUser,
      });
      groupFixtures.push({
        id: `m-grp-${group.id}-1-2`,
        round: 'group_match_1',
        groupLetter: group.id,
        homeTeam: t3,
        awayTeam: t4,
        status: 'scheduled',
        isUserMatch: t3.isUser || t4.isUser,
      });

      // Matchday 2: t1 vs t3, t2 vs t4
      groupFixtures.push({
        id: `m-grp-${group.id}-2-1`,
        round: 'group_match_2',
        groupLetter: group.id,
        homeTeam: t1,
        awayTeam: t3,
        status: 'scheduled',
        isUserMatch: t1.isUser || t3.isUser,
      });
      groupFixtures.push({
        id: `m-grp-${group.id}-2-2`,
        round: 'group_match_2',
        groupLetter: group.id,
        homeTeam: t2,
        awayTeam: t4,
        status: 'scheduled',
        isUserMatch: t2.isUser || t4.isUser,
      });

      // Matchday 3: t1 vs t4, t2 vs t3
      groupFixtures.push({
        id: `m-grp-${group.id}-3-1`,
        round: 'group_match_3',
        groupLetter: group.id,
        homeTeam: t1,
        awayTeam: t4,
        status: 'scheduled',
        isUserMatch: t1.isUser || t4.isUser,
      });
      groupFixtures.push({
        id: `m-grp-${group.id}-3-2`,
        round: 'group_match_3',
        groupLetter: group.id,
        homeTeam: t2,
        awayTeam: t3,
        status: 'scheduled',
        isUserMatch: t2.isUser || t3.isUser,
      });
    }

    const now = Date.now();
    return {
      id: `tourney-${now}-${prng.nextInt(100, 999)}`,
      name: params.name || (params.poolType === 'national' ? 'World Championship Cup' : 'Champions Heritage Cup'),
      poolType: params.poolType,
      draftMode: params.draftMode,
      matchDurationSec: params.matchDurationSec || (params.draftMode === 'campaign' ? 180 : 90),
      currentRound: 'group_match_1',
      groups,
      userTeam,
      userGroupLetter: 'A',
      groupFixtures,
      knockoutFixtures: {
        roundOf16: [],
        quarterFinals: [],
        semiFinals: [],
      },
      isEliminated: false,
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Builds an authentic full 11-player squad for an AI team based on its historical edition.
   */
  static buildAiTeamSquad(
    team: TournamentTeam,
    poolType: PoolType,
    players: PlayerVersion[],
    formationId = '4-3-3'
  ): PlayerDraftState {
    const formation = FORMATIONS[formationId] || FORMATIONS['4-3-3'];
    const teamDraft = DraftEngine.createInitialDraftState({
      seatId: 'guest',
      playerId: team.id,
      playerName: team.name,
      poolType,
      formationId: formation.id,
    });

    const teamPlayers = players.filter((p) => p.editionId === team.editionId);
    const candidateRoster = teamPlayers.length >= 11 ? teamPlayers : players.slice(0, 25);

    // Pick best player for each slot
    for (const slot of formation.slots) {
      const eligible = candidateRoster.filter(
        (p) =>
          !teamDraft.usedIdentityIds.includes(p.identityId) &&
          (p.naturalPositions.includes(slot.defaultPosition) ||
            (p.secondaryPositions && p.secondaryPositions.includes(slot.defaultPosition)))
      );

      const chosen =
        eligible.sort((a, b) => b.ovr - a.ovr)[0] ||
        candidateRoster.find((p) => !teamDraft.usedIdentityIds.includes(p.identityId)) ||
        candidateRoster[0];

      teamDraft.draftedSlots[slot.id] = {
        slotId: slot.id,
        player: chosen,
        assignedPosition: slot.defaultPosition,
      };
      teamDraft.usedIdentityIds.push(chosen.identityId);
    }

    teamDraft.isReady = true;
    return teamDraft;
  }

  /**
   * Simulates all remaining AI matches in the current round and updates group standings or bracket.
   */
  static simulateAiMatchesInRound(
    tournament: TournamentState,
    players: PlayerVersion[]
  ): void {
    const prng = new PRNG();

    if (tournament.currentRound.startsWith('group_match_')) {
      const currentMatches = tournament.groupFixtures.filter(
        (f) => f.round === tournament.currentRound && !f.isUserMatch && f.status === 'scheduled'
      );

      for (const fixture of currentMatches) {
        // Deterministic realistic simulation
        const homeGoals = prng.nextInt(0, 3) + (prng.chance(0.2) ? 1 : 0);
        const awayGoals = prng.nextInt(0, 3);
        fixture.homeScore = homeGoals;
        fixture.awayScore = awayGoals;
        fixture.status = 'finished';

        // Update group standings
        TournamentEngine.recordMatchResult(fixture.homeTeam, fixture.awayTeam, homeGoals, awayGoals);
      }

      // Sort all groups
      for (const group of tournament.groups) {
        TournamentEngine.sortGroupTeams(group);
      }
    }
  }

  /**
   * Records match outcome on group statistics (PTS, GD, GF, GA).
   */
  static recordMatchResult(
    home: TournamentTeam,
    away: TournamentTeam,
    homeScore: number,
    awayScore: number
  ): void {
    home.groupStats.played += 1;
    away.groupStats.played += 1;
    home.groupStats.goalsFor += homeScore;
    home.groupStats.goalsAgainst += awayScore;
    away.groupStats.goalsFor += awayScore;
    away.groupStats.goalsAgainst += homeScore;
    home.groupStats.goalDifference = home.groupStats.goalsFor - home.groupStats.goalsAgainst;
    away.groupStats.goalDifference = away.groupStats.goalsFor - away.groupStats.goalsAgainst;

    if (homeScore > awayScore) {
      home.groupStats.won += 1;
      home.groupStats.points += 3;
      away.groupStats.lost += 1;
    } else if (awayScore > homeScore) {
      away.groupStats.won += 1;
      away.groupStats.points += 3;
      home.groupStats.lost += 1;
    } else {
      home.groupStats.drawn += 1;
      away.groupStats.drawn += 1;
      home.groupStats.points += 1;
      away.groupStats.points += 1;
    }
  }

  /**
   * Sorts group teams by FIFA tiebreakers: Points > Goal Difference > Goals For.
   */
  static sortGroupTeams(group: TournamentGroup): void {
    group.teams.sort((a, b) => {
      if (b.groupStats.points !== a.groupStats.points) {
        return b.groupStats.points - a.groupStats.points;
      }
      if (b.groupStats.goalDifference !== a.groupStats.goalDifference) {
        return b.groupStats.goalDifference - a.groupStats.goalDifference;
      }
      return b.groupStats.goalsFor - a.groupStats.goalsFor;
    });
  }

  /**
   * Advances tournament after a user match finishes.
   */
  static advanceTournament(
    tournament: TournamentState,
    userMatchResult: {
      userScore: number;
      opponentScore: number;
      penaltyScore?: { user: number; opponent: number };
      simulation?: MatchSimulationState;
    },
    players: PlayerVersion[]
  ): TournamentState {
    const prng = new PRNG();

    // 1. Group Stage Rounds
    if (tournament.currentRound === 'group_match_1') {
      const userMatch = tournament.groupFixtures.find((f) => f.round === 'group_match_1' && f.isUserMatch)!;
      userMatch.homeScore = userMatch.homeTeam.isUser ? userMatchResult.userScore : userMatchResult.opponentScore;
      userMatch.awayScore = userMatch.awayTeam.isUser ? userMatchResult.userScore : userMatchResult.opponentScore;
      userMatch.status = 'finished';
      userMatch.simulation = userMatchResult.simulation;
      TournamentEngine.recordMatchResult(userMatch.homeTeam, userMatch.awayTeam, userMatch.homeScore, userMatch.awayScore);

      TournamentEngine.simulateAiMatchesInRound(tournament, players);
      tournament.currentRound = 'group_match_2';
      tournament.updatedAt = Date.now();
      return tournament;
    }

    if (tournament.currentRound === 'group_match_2') {
      const userMatch = tournament.groupFixtures.find((f) => f.round === 'group_match_2' && f.isUserMatch)!;
      userMatch.homeScore = userMatch.homeTeam.isUser ? userMatchResult.userScore : userMatchResult.opponentScore;
      userMatch.awayScore = userMatch.awayTeam.isUser ? userMatchResult.userScore : userMatchResult.opponentScore;
      userMatch.status = 'finished';
      userMatch.simulation = userMatchResult.simulation;
      TournamentEngine.recordMatchResult(userMatch.homeTeam, userMatch.awayTeam, userMatch.homeScore, userMatch.awayScore);

      TournamentEngine.simulateAiMatchesInRound(tournament, players);
      tournament.currentRound = 'group_match_3';
      tournament.updatedAt = Date.now();
      return tournament;
    }

    if (tournament.currentRound === 'group_match_3') {
      const userMatch = tournament.groupFixtures.find((f) => f.round === 'group_match_3' && f.isUserMatch)!;
      userMatch.homeScore = userMatch.homeTeam.isUser ? userMatchResult.userScore : userMatchResult.opponentScore;
      userMatch.awayScore = userMatch.awayTeam.isUser ? userMatchResult.userScore : userMatchResult.opponentScore;
      userMatch.status = 'finished';
      userMatch.simulation = userMatchResult.simulation;
      TournamentEngine.recordMatchResult(userMatch.homeTeam, userMatch.awayTeam, userMatch.homeScore, userMatch.awayScore);

      TournamentEngine.simulateAiMatchesInRound(tournament, players);

      // Check if user finished in top 2 of Group A
      const groupA = tournament.groups.find((g) => g.id === 'A')!;
      TournamentEngine.sortGroupTeams(groupA);
      const userRank = groupA.teams.findIndex((t) => t.isUser);

      if (userRank > 1) {
        // User finished 3rd or 4th - eliminated from tournament
        tournament.isEliminated = true;
        tournament.currentRound = 'completed';
        tournament.updatedAt = Date.now();
        return tournament;
      }

      // Generate Round of 16 Bracket
      TournamentEngine.setupRoundOf16(tournament);
      tournament.currentRound = 'round_of_16';
      tournament.updatedAt = Date.now();
      return tournament;
    }

    // 2. Round of 16
    if (tournament.currentRound === 'round_of_16') {
      const userMatch = tournament.knockoutFixtures.roundOf16.find((m) => m.isUserMatch)!;
      userMatch.homeScore = userMatch.homeTeam.isUser ? userMatchResult.userScore : userMatchResult.opponentScore;
      userMatch.awayScore = userMatch.awayTeam.isUser ? userMatchResult.userScore : userMatchResult.opponentScore;
      userMatch.status = 'finished';
      userMatch.simulation = userMatchResult.simulation;

      const userWon = TournamentEngine.didUserWinKnockout(userMatch, userMatchResult.penaltyScore);
      if (!userWon) {
        tournament.isEliminated = true;
        tournament.currentRound = 'completed';
        tournament.updatedAt = Date.now();
        return tournament;
      }

      // Simulate other R16 matches and set up Quarter-Finals
      TournamentEngine.setupQuarterFinals(tournament);
      tournament.currentRound = 'quarter_finals';
      tournament.updatedAt = Date.now();
      return tournament;
    }

    // 3. Quarter-Finals
    if (tournament.currentRound === 'quarter_finals') {
      const userMatch = tournament.knockoutFixtures.quarterFinals.find((m) => m.isUserMatch)!;
      userMatch.homeScore = userMatch.homeTeam.isUser ? userMatchResult.userScore : userMatchResult.opponentScore;
      userMatch.awayScore = userMatch.awayTeam.isUser ? userMatchResult.userScore : userMatchResult.opponentScore;
      userMatch.status = 'finished';
      userMatch.simulation = userMatchResult.simulation;

      const userWon = TournamentEngine.didUserWinKnockout(userMatch, userMatchResult.penaltyScore);
      if (!userWon) {
        tournament.isEliminated = true;
        tournament.currentRound = 'completed';
        tournament.updatedAt = Date.now();
        return tournament;
      }

      // Setup Semi-Finals
      TournamentEngine.setupSemiFinals(tournament);
      tournament.currentRound = 'semi_finals';
      tournament.updatedAt = Date.now();
      return tournament;
    }

    // 4. Semi-Finals
    if (tournament.currentRound === 'semi_finals') {
      const userMatch = tournament.knockoutFixtures.semiFinals.find((m) => m.isUserMatch)!;
      userMatch.homeScore = userMatch.homeTeam.isUser ? userMatchResult.userScore : userMatchResult.opponentScore;
      userMatch.awayScore = userMatch.awayTeam.isUser ? userMatchResult.userScore : userMatchResult.opponentScore;
      userMatch.status = 'finished';
      userMatch.simulation = userMatchResult.simulation;

      const userWon = TournamentEngine.didUserWinKnockout(userMatch, userMatchResult.penaltyScore);
      if (!userWon) {
        tournament.isEliminated = true;
        tournament.currentRound = 'completed';
        tournament.updatedAt = Date.now();
        return tournament;
      }

      // Setup Grand Final
      TournamentEngine.setupFinal(tournament);
      tournament.currentRound = 'final';
      tournament.updatedAt = Date.now();
      return tournament;
    }

    // 5. Grand Final
    if (tournament.currentRound === 'final') {
      const userMatch = tournament.knockoutFixtures.final!;
      userMatch.homeScore = userMatch.homeTeam.isUser ? userMatchResult.userScore : userMatchResult.opponentScore;
      userMatch.awayScore = userMatch.awayTeam.isUser ? userMatchResult.userScore : userMatchResult.opponentScore;
      userMatch.status = 'finished';
      userMatch.simulation = userMatchResult.simulation;

      const userWon = TournamentEngine.didUserWinKnockout(userMatch, userMatchResult.penaltyScore);
      if (userWon) {
        tournament.champion = tournament.userTeam;
        tournament.runnerUp = userMatch.homeTeam.isUser ? userMatch.awayTeam : userMatch.homeTeam;
      } else {
        tournament.isEliminated = true;
        tournament.champion = userMatch.homeTeam.isUser ? userMatch.awayTeam : userMatch.homeTeam;
        tournament.runnerUp = tournament.userTeam;
      }

      tournament.currentRound = 'completed';
      tournament.updatedAt = Date.now();
      return tournament;
    }

    return tournament;
  }

  private static didUserWinKnockout(
    match: TournamentMatchFixture,
    penaltyScore?: { user: number; opponent: number }
  ): boolean {
    const userScore = match.homeTeam.isUser ? match.homeScore! : match.awayScore!;
    const oppScore = match.homeTeam.isUser ? match.awayScore! : match.homeScore!;

    if (userScore > oppScore) return true;
    if (userScore < oppScore) return false;

    // Tie-break with penalties
    if (penaltyScore) {
      return penaltyScore.user > penaltyScore.opponent;
    }
    return false;
  }

  private static setupRoundOf16(tournament: TournamentState): void {
    const prng = new PRNG();
    const getGroupTopTwo = (letter: string) => {
      const g = tournament.groups.find((x) => x.id === letter)!;
      TournamentEngine.sortGroupTeams(g);
      return [g.teams[0], g.teams[1]];
    };

    const [a1, a2] = getGroupTopTwo('A');
    const [b1, b2] = getGroupTopTwo('B');
    const [c1, c2] = getGroupTopTwo('C');
    const [d1, d2] = getGroupTopTwo('D');
    const [e1, e2] = getGroupTopTwo('E');
    const [f1, f2] = getGroupTopTwo('F');
    const [g1, g2] = getGroupTopTwo('G');
    const [h1, h2] = getGroupTopTwo('H');

    const pairings = [
      { home: a1, away: b2 }, // Match 1 (User is either home or in match 5)
      { home: c1, away: d2 }, // Match 2
      { home: e1, away: f2 }, // Match 3
      { home: g1, away: h2 }, // Match 4
      { home: b1, away: a2 }, // Match 5 (If user was 2nd in Group A)
      { home: d1, away: c2 }, // Match 6
      { home: f1, away: e2 }, // Match 7
      { home: h1, away: g2 }, // Match 8
    ];

    tournament.knockoutFixtures.roundOf16 = pairings.map((p, idx) => ({
      id: `m-r16-${idx + 1}`,
      round: 'round_of_16',
      homeTeam: p.home,
      awayTeam: p.away,
      status: 'scheduled',
      isUserMatch: p.home.isUser || p.away.isUser,
    }));
  }

  private static setupQuarterFinals(tournament: TournamentState): void {
    const prng = new PRNG();
    const r16Winners: TournamentTeam[] = [];

    for (const match of tournament.knockoutFixtures.roundOf16) {
      if (match.isUserMatch) {
        r16Winners.push(tournament.userTeam);
      } else {
        const homeWon = prng.chance(0.55);
        match.homeScore = homeWon ? 2 : 1;
        match.awayScore = homeWon ? 1 : 2;
        match.status = 'finished';
        r16Winners.push(homeWon ? match.homeTeam : match.awayTeam);
      }
    }

    // 4 Quarter Final Matchups
    tournament.knockoutFixtures.quarterFinals = [
      { id: 'm-qf-1', round: 'quarter_finals', homeTeam: r16Winners[0], awayTeam: r16Winners[1], status: 'scheduled', isUserMatch: r16Winners[0].isUser || r16Winners[1].isUser },
      { id: 'm-qf-2', round: 'quarter_finals', homeTeam: r16Winners[2], awayTeam: r16Winners[3], status: 'scheduled', isUserMatch: r16Winners[2].isUser || r16Winners[3].isUser },
      { id: 'm-qf-3', round: 'quarter_finals', homeTeam: r16Winners[4], awayTeam: r16Winners[5], status: 'scheduled', isUserMatch: r16Winners[4].isUser || r16Winners[5].isUser },
      { id: 'm-qf-4', round: 'quarter_finals', homeTeam: r16Winners[6], awayTeam: r16Winners[7], status: 'scheduled', isUserMatch: r16Winners[6].isUser || r16Winners[7].isUser },
    ];
  }

  private static setupSemiFinals(tournament: TournamentState): void {
    const prng = new PRNG();
    const qfWinners: TournamentTeam[] = [];

    for (const match of tournament.knockoutFixtures.quarterFinals) {
      if (match.isUserMatch) {
        qfWinners.push(tournament.userTeam);
      } else {
        const homeWon = prng.chance(0.52);
        match.homeScore = homeWon ? 2 : 1;
        match.awayScore = homeWon ? 1 : 2;
        match.status = 'finished';
        qfWinners.push(homeWon ? match.homeTeam : match.awayTeam);
      }
    }

    // 2 Semi Final Matchups
    tournament.knockoutFixtures.semiFinals = [
      { id: 'm-sf-1', round: 'semi_finals', homeTeam: qfWinners[0], awayTeam: qfWinners[1], status: 'scheduled', isUserMatch: qfWinners[0].isUser || qfWinners[1].isUser },
      { id: 'm-sf-2', round: 'semi_finals', homeTeam: qfWinners[2], awayTeam: qfWinners[3], status: 'scheduled', isUserMatch: qfWinners[2].isUser || qfWinners[3].isUser },
    ];
  }

  private static setupFinal(tournament: TournamentState): void {
    const prng = new PRNG();
    const sfWinners: TournamentTeam[] = [];

    for (const match of tournament.knockoutFixtures.semiFinals) {
      if (match.isUserMatch) {
        sfWinners.push(tournament.userTeam);
      } else {
        const homeWon = prng.chance(0.5);
        match.homeScore = homeWon ? 2 : 1;
        match.awayScore = homeWon ? 1 : 2;
        match.status = 'finished';
        sfWinners.push(homeWon ? match.homeTeam : match.awayTeam);
      }
    }

    tournament.knockoutFixtures.final = {
      id: 'm-final',
      round: 'final',
      homeTeam: sfWinners[0],
      awayTeam: sfWinners[1],
      status: 'scheduled',
      isUserMatch: sfWinners[0].isUser || sfWinners[1].isUser,
    };
  }

  /**
   * Helper to fetch the current user match fixture in the tournament.
   */
  static getCurrentUserMatch(tournament: TournamentState): TournamentMatchFixture | null {
    if (tournament.isEliminated || tournament.currentRound === 'completed') {
      return null;
    }

    if (tournament.currentRound.startsWith('group_match_')) {
      return tournament.groupFixtures.find(
        (f) => f.round === tournament.currentRound && f.isUserMatch && f.status === 'scheduled'
      ) || null;
    }

    if (tournament.currentRound === 'round_of_16') {
      return tournament.knockoutFixtures.roundOf16.find((f) => f.isUserMatch && f.status === 'scheduled') || null;
    }

    if (tournament.currentRound === 'quarter_finals') {
      return tournament.knockoutFixtures.quarterFinals.find((f) => f.isUserMatch && f.status === 'scheduled') || null;
    }

    if (tournament.currentRound === 'semi_finals') {
      return tournament.knockoutFixtures.semiFinals.find((f) => f.isUserMatch && f.status === 'scheduled') || null;
    }

    if (tournament.currentRound === 'final') {
      return tournament.knockoutFixtures.final && tournament.knockoutFixtures.final.status === 'scheduled'
        ? tournament.knockoutFixtures.final
        : null;
    }

    return null;
  }
}
