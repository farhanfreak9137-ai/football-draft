import {
  ManagerProfile,
  PoolType,
  TournamentDraftMode,
  SavedDreamTeam,
  DreamTeamPlayerStats,
} from '../../shared/types/index.js';

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
        const loaded: ManagerProfile = { ...DEFAULT_PROFILE, ...JSON.parse(data) };
        const initialCount = loaded.trophies?.length || 0;
        this.sanitizeProfileTrophies(loaded);
        if (loaded.trophies?.length !== initialCount) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
          } catch (e) {}
        }
        return loaded;
      }
    } catch (e) {}
    return { ...DEFAULT_PROFILE };
  }

  private sanitizeProfileTrophies(profile: ManagerProfile): void {
    if (!profile.trophies || !Array.isArray(profile.trophies)) {
      profile.trophies = [];
      return;
    }

    const SANITIZE_KEY = 'hfd_runnerup_sanitized_v2';
    let alreadySanitized = false;
    try {
      alreadySanitized = typeof localStorage !== 'undefined' && localStorage.getItem(SANITIZE_KEY) === 'true';
    } catch (e) {}

    if (!alreadySanitized) {
      const goldCount = profile.trophies.filter((t) => t.type === 'gold').length;
      const totalWins = profile.stats?.wins || 0;
      // Winning 1 World Championship gold requires at least 5 wins in knockouts/groups.
      // Reaching the final as runner-up requires at least 4 wins in knockouts/groups.
      const maxPossibleRunnerUps = Math.max(0, Math.floor((totalWins - (goldCount * 5)) / 4));

      const silverTrophies = profile.trophies.filter((t) => t.type === 'silver');
      if (silverTrophies.length > maxPossibleRunnerUps) {
        // Prune unearned runner-up trophies created by the legacy campaign completion bug
        const validSilvers = silverTrophies.slice(0, maxPossibleRunnerUps);
        profile.trophies = [
          ...profile.trophies.filter((t) => t.type === 'gold'),
          ...validSilvers,
        ];
      }

      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(SANITIZE_KEY, 'true');
        }
      } catch (e) {}
    }

    // Always synchronize stats counters with actual trophy cabinet
    if (profile.stats) {
      profile.stats.trophiesWon = profile.trophies.filter((t) => t.type === 'gold').length;
      profile.stats.runnerUpCount = profile.trophies.filter((t) => t.type === 'silver').length;
    }
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

  addXp(amount: number): ManagerProfile {
    this.profile.xp += Math.max(0, amount);
    this.profile.level = Math.floor(this.profile.xp / 300) + 1;
    this.saveProfile();
    return this.getProfile();
  }

  recordTournament(params: {
    tournamentName: string;
    result?: 'champion' | 'runner_up' | 'eliminated';
    won?: boolean;
    isRunnerUp?: boolean;
    poolType: PoolType;
    draftMode: TournamentDraftMode;
  }): ManagerProfile {
    const s = this.profile.stats;
    s.tournamentsPlayed += 1;

    const outcome =
      params.result ||
      (params.won ? 'champion' : params.isRunnerUp ? 'runner_up' : 'eliminated');

    if (outcome === 'champion') {
      s.trophiesWon += 1;
      this.profile.xp += 500;
      this.profile.trophies.unshift({
        id: `trophy-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        tournamentName: params.tournamentName,
        date: Date.now(),
        type: 'gold',
        poolType: params.poolType,
        draftMode: params.draftMode,
      });
    } else if (outcome === 'runner_up') {
      s.runnerUpCount += 1;
      this.profile.xp += 250;
      this.profile.trophies.unshift({
        id: `trophy-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        tournamentName: params.tournamentName,
        date: Date.now(),
        type: 'silver',
        poolType: params.poolType,
        draftMode: params.draftMode,
      });
    } else {
      // Eliminated early (group stage, R16, QF, SF)
      // Strictly NO trophy awarded! Only 1st (gold) and 2nd (silver) receive trophies.
      this.profile.xp += 50;
    }

    this.profile.level = Math.floor(this.profile.xp / 300) + 1;
    this.saveProfile();
    return this.getProfile();
  }

  removeTrophy(trophyId: string): ManagerProfile {
    const trophy = this.profile.trophies.find((t) => t.id === trophyId);
    if (!trophy) return this.getProfile();

    if (trophy.type === 'gold') {
      this.profile.stats.trophiesWon = Math.max(0, this.profile.stats.trophiesWon - 1);
    } else if (trophy.type === 'silver') {
      this.profile.stats.runnerUpCount = Math.max(0, this.profile.stats.runnerUpCount - 1);
    }

    this.profile.trophies = this.profile.trophies.filter((t) => t.id !== trophyId);
    this.saveProfile();
    return this.getProfile();
  }

  clearRunnerUpTrophies(): ManagerProfile {
    this.profile.trophies = this.profile.trophies.filter((t) => t.type !== 'silver');
    this.profile.stats.runnerUpCount = 0;
    this.saveProfile();
    return this.getProfile();
  }

  saveDreamTeam(team: SavedDreamTeam): ManagerProfile {
    const existingPlayerStats = this.profile.dreamTeam?.playerStats || {};
    const existingTeamStats = this.profile.dreamTeam?.teamStats || {
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    };

    const playerStats: Record<string, DreamTeamPlayerStats> = {};
    const allSlots = [
      ...Object.values(team.draftedSlots),
      ...Object.values(team.benchSlots || {}),
    ];
    for (const slot of allSlots) {
      const pId = slot.player.identityId || slot.player.id;
      playerStats[pId] = existingPlayerStats[pId] || {
        appearances: 0,
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        motmAwards: 0,
        yellowCards: 0,
        redCards: 0,
        totalRating: 0,
      };
    }

    this.profile.dreamTeam = {
      ...team,
      playerStats,
      teamStats: existingTeamStats,
    };
    this.saveProfile();
    return this.getProfile();
  }

  recordDreamTeamMatch(params: {
    userScore: number;
    opponentScore: number;
    opponentName: string;
    playerMatchStats: Array<{
      identityId: string;
      goals: number;
      assists: number;
      cleanSheet: boolean;
      motm: boolean;
      yellowCard: boolean;
      redCard: boolean;
      rating: number;
    }>;
  }): ManagerProfile {
    if (!this.profile.dreamTeam) return this.getProfile();

    const dt = this.profile.dreamTeam;
    if (!dt.teamStats) {
      dt.teamStats = {
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      };
    }
    if (!dt.playerStats) {
      dt.playerStats = {};
    }

    // Update Team Stats
    dt.teamStats.matchesPlayed += 1;
    dt.teamStats.goalsFor += params.userScore;
    dt.teamStats.goalsAgainst += params.opponentScore;

    const isWin = params.userScore > params.opponentScore;
    const isDraw = params.userScore === params.opponentScore;

    if (isWin) {
      dt.teamStats.wins += 1;
      this.profile.xp += 80;
    } else if (isDraw) {
      dt.teamStats.draws += 1;
      this.profile.xp += 30;
    } else {
      dt.teamStats.losses += 1;
      this.profile.xp += 15;
    }

    this.profile.stats.matchesPlayed += 1;
    if (isWin) this.profile.stats.wins += 1;
    else if (isDraw) this.profile.stats.draws += 1;
    else this.profile.stats.losses += 1;
    this.profile.stats.goalsScored += params.userScore;
    this.profile.stats.goalsConceded += params.opponentScore;

    // Update Player Stats
    for (const p of params.playerMatchStats) {
      if (!dt.playerStats[p.identityId]) {
        dt.playerStats[p.identityId] = {
          appearances: 0,
          goals: 0,
          assists: 0,
          cleanSheets: 0,
          motmAwards: 0,
          yellowCards: 0,
          redCards: 0,
          totalRating: 0,
        };
      }
      const s = dt.playerStats[p.identityId];
      s.appearances += 1;
      s.goals += p.goals;
      s.assists += p.assists;
      if (p.cleanSheet) s.cleanSheets += 1;
      if (p.motm) s.motmAwards += 1;
      if (p.yellowCard) s.yellowCards += 1;
      if (p.redCard) s.redCards += 1;
      s.totalRating += p.rating;
    }

    // Add to profile recent matches
    this.profile.recentMatches.unshift({
      opponentName: `${params.opponentName} (Dream Team AI)`,
      score: `${params.userScore}-${params.opponentScore}`,
      result: isWin ? 'win' : isDraw ? 'draw' : 'loss',
      date: Date.now(),
      stage: 'TITAN EXHIBITION',
    });
    if (this.profile.recentMatches.length > 10) {
      this.profile.recentMatches.pop();
    }

    this.profile.level = Math.floor(this.profile.xp / 300) + 1;
    this.saveProfile();
    return this.getProfile();
  }

  getDreamTeam(): SavedDreamTeam | null {
    return this.profile.dreamTeam || null;
  }

  clearDreamTeam(): ManagerProfile {
    delete this.profile.dreamTeam;
    this.saveProfile();
    return this.getProfile();
  }
}

export const profileService = ProfileService.getInstance();

