import {
  FormationDefinition,
  MatchSimulationState,
  PoolType,
  TournamentDraftMode,
  TournamentMatchFixture,
  TournamentState,
} from '../../shared/types/index.js';
import { TournamentEngine } from '../../shared/engine/tournamentEngine.js';
import { offlineSoloEngine } from './offlineSoloEngine.js';
import { profileService } from './profileService.js';

const STORAGE_KEY = 'hfd_active_tournament';

export class TournamentService {
  private static instance: TournamentService;
  private activeTournament: TournamentState | null = null;

  private constructor() {
    this.activeTournament = this.loadActiveTournament();
  }

  static getInstance(): TournamentService {
    if (!TournamentService.instance) {
      TournamentService.instance = new TournamentService();
    }
    return TournamentService.instance;
  }

  private loadActiveTournament(): TournamentState | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {}
    return null;
  }

  private saveActiveTournament(): void {
    try {
      if (this.activeTournament) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.activeTournament));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {}
  }

  getActiveTournament(): TournamentState | null {
    return this.activeTournament ? { ...this.activeTournament } : null;
  }

  startTournament(params: {
    name?: string;
    poolType: PoolType;
    draftMode: TournamentDraftMode;
    matchDurationSec: number;
    userName: string;
    userFormationId?: string;
    userCustomFormation?: FormationDefinition;
  }): TournamentState {
    const editions = offlineSoloEngine.getEditions();
    const players = offlineSoloEngine.getPlayers();

    const tournament = TournamentEngine.createTournament({
      name: params.name,
      poolType: params.poolType,
      draftMode: params.draftMode,
      matchDurationSec: params.matchDurationSec,
      userName: params.userName,
      userFormationId: params.userFormationId,
      userCustomFormation: params.userCustomFormation,
      editions,
      players,
    });

    this.activeTournament = tournament;
    this.saveActiveTournament();
    return this.activeTournament;
  }

  getCurrentUserMatch(): TournamentMatchFixture | null {
    if (!this.activeTournament) return null;
    return TournamentEngine.getCurrentUserMatch(this.activeTournament);
  }

  recordUserMatchResult(result: {
    userScore: number;
    opponentScore: number;
    penaltyScore?: { user: number; opponent: number };
    simulation?: MatchSimulationState;
  }): TournamentState {
    if (!this.activeTournament) {
      throw new Error('No active tournament');
    }

    const currentMatch = this.getCurrentUserMatch();
    const opponentName = currentMatch
      ? (currentMatch.homeTeam.isUser ? currentMatch.awayTeam.name : currentMatch.homeTeam.name)
      : 'Opponent';

    const stageLabel = this.activeTournament.currentRound.replace(/_/g, ' ').toUpperCase();
    const isWin = result.userScore > result.opponentScore ||
      (result.penaltyScore ? result.penaltyScore.user > result.penaltyScore.opponent : false);
    const isDraw = result.userScore === result.opponentScore && !result.penaltyScore;

    // Record on manager profile
    profileService.recordMatch({
      opponentName,
      score: `${result.userScore}-${result.opponentScore}`,
      result: isWin ? 'win' : isDraw ? 'draw' : 'loss',
      stage: stageLabel,
      goalsScored: result.userScore,
      goalsConceded: result.opponentScore,
    });

    const updated = TournamentEngine.advanceTournament(
      this.activeTournament,
      result,
      offlineSoloEngine.getPlayers()
    );

    // If tournament just finished (Final or eliminated)
    if (updated.currentRound === 'completed') {
      profileService.recordTournament({
        tournamentName: updated.name,
        won: Boolean(updated.champion && updated.champion.isUser),
        poolType: updated.poolType,
        draftMode: updated.draftMode,
      });
    }

    this.activeTournament = updated;
    this.saveActiveTournament();
    return this.activeTournament;
  }

  abandonTournament(): void {
    this.activeTournament = null;
    this.saveActiveTournament();
  }
}

export const tournamentService = TournamentService.getInstance();

