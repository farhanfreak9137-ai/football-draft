import { ManagerProfile, PoolType, TournamentDraftMode } from '../../shared/types/index.js';

const STORAGE_KEY = 'hfd_manager_profile';

const DEFAULT_PROFILE: ManagerProfile = {
  id: 'manager-local',
  managerName: 'Manager',
  avatarEmoji: '👔',
  level: 1,
  xp: 0,
  stats: {
    matchesPlayed: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsScored: 0,
    goalsConceded: 0,
    cleanSheets: 0,
    trophiesWon: 0,
    runnerUpCount: 0,
    tournamentsPlayed: 0,
  },
  trophies: [],
  recentMatches: [],
};

export class ProfileService {
  private static instance: ProfileService;
  private profile: ManagerProfile;

  private constructor() {
    this.profile = this.loadProfile();
  }

  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  private loadProfile(): ManagerProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
      }
    } catch (e) {}
    return { ...DEFAULT_PROFILE };
  }

  private saveProfile(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
    } catch (e) {}
  }

  getProfile(): ManagerProfile {
    return { ...this.profile };
  }

  updateManagerName(managerName: string, avatarEmoji?: string): ManagerProfile {
    this.profile.managerName = managerName.trim() || 'Manager';
    if (avatarEmoji) this.profile.avatarEmoji = avatarEmoji;
    this.saveProfile();
    return this.getProfile();
  }

  recordMatch(params: {
    opponentName: string;
    score: string;
    result: 'win' | 'loss' | 'draw';
    stage: string;
    goalsScored: number;
    goalsConceded: number;
  }): ManagerProfile {
    const s = this.profile.stats;
    s.matchesPlayed += 1;
    if (params.result === 'win') {
      s.wins += 1;
      this.profile.xp += 100;
    } else if (params.result === 'draw') {
      s.draws += 1;
      this.profile.xp += 40;
    } else {
      s.losses += 1;
      this.profile.xp += 20;
    }

    s.goalsScored += params.goalsScored;
    s.goalsConceded += params.goalsConceded;
    if (params.goalsConceded === 0) s.cleanSheets += 1;

    // Level progression (every 300 XP is a manager level)
    this.profile.level = Math.floor(this.profile.xp / 300) + 1;

    // Prepend to recent matches (keep last 10)
    this.profile.recentMatches.unshift({
      opponentName: params.opponentName,
      score: params.score,
      result: params.result,
      date: Date.now(),
      stage: params.stage,
    });
    if (this.profile.recentMatches.length > 10) {
      this.profile.recentMatches.pop();
    }

    this.saveProfile();
    return this.getProfile();
  }

  recordTournament(params: {
    tournamentName: string;
    won: boolean;
    poolType: PoolType;
    draftMode: TournamentDraftMode;
  }): ManagerProfile {
    const s = this.profile.stats;
    s.tournamentsPlayed += 1;
    if (params.won) {
      s.trophiesWon += 1;
      this.profile.xp += 500;
      this.profile.trophies.unshift({
        id: `trophy-${Date.now()}`,
        tournamentName: params.tournamentName,
        date: Date.now(),
        type: 'gold',
        poolType: params.poolType,
        draftMode: params.draftMode,
      });
    } else {
      s.runnerUpCount += 1;
      this.profile.xp += 200;
      this.profile.trophies.unshift({
        id: `trophy-${Date.now()}`,
        tournamentName: params.tournamentName,
        date: Date.now(),
        type: 'silver',
        poolType: params.poolType,
        draftMode: params.draftMode,
      });
    }

    this.profile.level = Math.floor(this.profile.xp / 300) + 1;
    this.saveProfile();
    return this.getProfile();
  }
}

export const profileService = ProfileService.getInstance();

