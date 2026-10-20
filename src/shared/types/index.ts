export type Position = 
  | 'GK' 
  | 'CB' 
  | 'LB' 
  | 'RB' 
  | 'LWB' 
  | 'RWB' 
  | 'CDM' 
  | 'CM' 
  | 'CAM' 
  | 'LM' 
  | 'RM' 
  | 'LW' 
  | 'RW' 
  | 'CF' 
  | 'ST' 
  | 'SS';

export type PositionGroup = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface FormationSlot {
  id: string; // e.g. "gk", "lb", "cb1", "cb2", "rb", "cm1", etc.
  name: string; // "Goalkeeper", "Left Back", etc.
  group: PositionGroup;
  defaultPosition: Position;
  eligiblePositions: Position[];
  coordinates: { x: number; y: number }; // Percentage 0-100 on tactical pitch
}

export interface FormationDefinition {
  id: string;
  name: string; // "4-3-3", "4-4-2", "4-2-3-1", "3-5-2"
  description: string;
  slots: FormationSlot[];
  isCustom?: boolean;
}

export type Strategy = 'attacking' | 'balanced' | 'defensive';
export type PoolType = 'national' | 'club';

export interface SquadRoles {
  captainSlotId?: string;
  penaltySlotId?: string;
  freeKickSlotId?: string;
  cornerSlotId?: string;
}

export type TacticalGameplan = 'balanced' | 'possession' | 'counter' | 'high_press' | 'defensive' | 'attacking';
export type LiveMentality = 'defensive' | 'balanced' | 'attacking';

export interface SourceReference {
  sourceId: string;
  fact: string;
}

export interface SourceRecord {
  id: string;
  sourceName: string;
  url: string;
  accessDate: string;
  factSupported: string;
  verificationStatus: 'verified' | 'partially_verified' | 'pending_research';
  licenseNotes: string;
}

export interface PlayerIdentity {
  id: string; // Stable slug/ID (e.g. "diego-maradona")
  name: string;
  commonName?: string;
  nationality: string;
  birthYear: number;
  canonicalPosition: Position;
}

export interface TeamIdentity {
  id: string;
  name: string;
  type: PoolType;
  country: string;
}

export interface TeamEdition {
  id: string;
  teamId: string;
  teamName: string;
  editionType: PoolType;
  yearOrSeason: string;
  competition: string;
  achievement: string;
  coach: string;
  tacticalFormation: string;
  verifiedSourceIds: string[];
  verificationStatus: 'verified' | 'partially_verified' | 'pending_research';
}

export interface PlayerVersion {
  id: string; // Unique edition-player ID (e.g. "maradona-1986")
  identityId: string; // Links to PlayerIdentity
  editionId: string; // Links to TeamEdition
  name: string;
  squadNumber: number;
  ovr: number; // 1-100 scale for specific tournament/season form
  naturalPositions: Position[];
  secondaryPositions: Position[];
  hasLegendSeal: boolean; // Standout performance honor
  legendSealReason?: string;
  tournamentOrSeasonStats: {
    appearances: number;
    goals: number;
    assists?: number;
    cleanSheets?: number;
  };
  ratingRationale: string;
  methodologyVersion: string;
  reviewer: string;
  reviewDate: string;
  verificationStatus: 'verified' | 'partially_verified' | 'pending_research';
  sources: SourceReference[];
}

export interface DraftedSlot {
  slotId: string;
  player: PlayerVersion;
  assignedPosition: Position;
}

export interface PlayerDraftState {
  seatId: 'host' | 'guest';
  playerId: string;
  playerName: string;
  poolType: PoolType;
  formation: FormationDefinition;
  strategy: Strategy;
  roles?: SquadRoles;
  gameplan?: TacticalGameplan;
  draftedSlots: Record<string, DraftedSlot>; // slotId -> DraftedSlot
  usedIdentityIds: string[]; // Uniqueness tracker
  rerollsRemaining: number; // 3 per XI
  currentTeamEdition: TeamEdition | null;
  currentRoster: PlayerVersion[];
  isReady: boolean;
}

export type DraftTurn = 'host' | 'guest';

export interface RoomState {
  roomCode: string;
  status: 'lobby' | 'drafting' | 'draft_complete' | 'match_ready' | 'simulating' | 'match_finished' | 'closed';
  mode: 'solo' | 'multiplayer';
  poolType: PoolType;
  createdAt: number;
  updatedAt: number;
  expiresAt: number; // 1 hour expiration
  hostSeat: {
    token: string;
    connected: boolean;
    lastPing: number;
  };
  guestSeat?: {
    token: string;
    connected: boolean;
    lastPing: number;
  };
  hostDraft: PlayerDraftState;
  guestDraft?: PlayerDraftState;
  activeTurn: DraftTurn;
  turnDeadline: number; // Server-authoritative epoch timestamp in ms (40s per turn)
  turnNumber: number;
  matchId?: string;
  matchFormat?: 'auto' | 'normal' | 'knockout';
  matchDurationSec?: number; // 45, 90, 180 (3 min), 240 (4 min)
  lastPickAnnouncement?: {
    seat: 'host' | 'guest';
    playerName: string;
    squadNumber: number;
    position: string;
    teamEditionName?: string;
  };
}

// Match simulation types
export type MatchEventType = 
  | 'kickoff'
  | 'attack'
  | 'chance'
  | 'shot'
  | 'save'
  | 'yellow_card'
  | 'red_card'
  | 'defensive_intervention'
  | 'goal'
  | 'miss'
  | 'halftime'
  | 'late_pressure'
  | 'fulltime'
  | 'extra_time_start'
  | 'extra_time_half'
  | 'extra_time_end'
  | 'penalty_shootout_start'
  | 'penalty_kick'
  | 'match_end';

export interface MatchEvent {
  id: string;
  second: number; // Real second elapsed
  minute?: number; // Simulated visual match minute (0 to 90, or up to 120 in ET)
  period: 'first_half' | 'second_half' | 'extra_time_1' | 'extra_time_2' | 'penalties';
  type: MatchEventType;
  team: 'host' | 'guest';
  player?: {
    id: string;
    name: string;
    position: Position;
    squadNumber: number;
  };
  secondaryPlayer?: {
    id: string;
    name: string;
    position: Position;
    squadNumber: number;
  };
  description: string;
  score: {
    host: number;
    guest: number;
  };
  isGoal?: boolean;
  pitchLocation?: {
    x: number; // 0-100 percentage length of pitch
    y: number; // 0-100 percentage width of pitch
  };
}

export interface PenaltyKickResult {
  round: number;
  team: 'host' | 'guest';
  kicker: {
    id: string;
    name: string;
    squadNumber: number;
  };
  scored: boolean;
  suddenDeath: boolean;
  description: string;
}

export interface MatchSimulationState {
  matchId: string;
  startTime: number;
  totalDurationMs: number;
  totalDurationSeconds: number;
  regularDurationSeconds?: number;
  currentElapsedSec: number;
  currentSecond: number;
  status: 'live' | 'halftime' | 'extra_time' | 'penalties' | 'fulltime' | 'completed';
  currentMinute: number; // 0-90 (or up to 120)
  knockoutMode: boolean;
  matchFormat?: 'league' | 'cup';
  hostTeam: {
    name: string;
    formation: string;
    avgOvr: number;
    roles?: SquadRoles;
  };
  guestTeam: {
    name: string;
    formation: string;
    avgOvr: number;
    roles?: SquadRoles;
  };
  events: MatchEvent[];
  visibleEvents: MatchEvent[];
  penalties?: PenaltyKickResult[];
  penaltyKicks?: PenaltyKickResult[];
  penaltyScore?: {
    host: number;
    guest: number;
  };
  score: {
    host: number;
    guest: number;
  };
  finalScore: {
    host: number;
    guest: number;
  };
  winner?: 'host' | 'guest' | 'draw';
  winMethod?: 'regular_time' | 'extra_time' | 'penalties' | 'draw';
  liveMentality?: LiveMentality;
  stats: {
    host: {
      shots: number;
      shotsOnTarget: number;
      saves: number;
      corners: number;
      tackles: number;
      fouls: number;
    };
    guest: {
      shots: number;
      shotsOnTarget: number;
      saves: number;
      corners: number;
      tackles: number;
      fouls: number;
    };
  };
}

export interface PlayerMatchRating {
  playerId: string;
  name: string;
  squadNumber: number;
  position: Position;
  ovr: number;
  team: 'host' | 'guest';
  rating: number; // 5.0 to 10.0 scale
  isStarOfMatch?: boolean;
  stats: {
    goals: number;
    assists: number;
    saves: number;
    yellowCard: boolean;
    redCard: boolean;
    penaltyScored: boolean;
    penaltyMissed: boolean;
    cleanSheet: boolean;
  };
  summary: string;
}

// Tournament System Types
export type TournamentDraftMode = 'campaign' | 'dynamic';

export interface TournamentTeam {
  id: string;
  name: string;
  editionId: string;
  poolType: PoolType;
  isUser: boolean;
  formationId?: string;
  squad?: PlayerDraftState;
  groupStats: {
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
  };
}

export interface TournamentGroup {
  id: string; // 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'
  name: string;
  teams: TournamentTeam[];
}

export type TournamentRound =
  | 'group_match_1'
  | 'group_match_2'
  | 'group_match_3'
  | 'round_of_16'
  | 'quarter_finals'
  | 'semi_finals'
  | 'final'
  | 'completed';

export interface TournamentMatchFixture {
  id: string;
  round: TournamentRound;
  groupLetter?: string;
  homeTeam: TournamentTeam;
  awayTeam: TournamentTeam;
  homeScore?: number;
  awayScore?: number;
  penaltyScore?: { home: number; away: number };
  status: 'scheduled' | 'live' | 'finished';
  isUserMatch: boolean;
  simulation?: MatchSimulationState;
}

export interface TournamentState {
  id: string;
  name: string;
  poolType: PoolType;
  draftMode: TournamentDraftMode;
  matchDurationSec: number; // 45s, 90s, 180s (3m), 240s (4m)
  currentRound: TournamentRound;
  groups: TournamentGroup[];
  userTeam: TournamentTeam;
  userGroupLetter: string;
  groupFixtures: TournamentMatchFixture[];
  knockoutFixtures: {
    roundOf16: TournamentMatchFixture[];
    quarterFinals: TournamentMatchFixture[];
    semiFinals: TournamentMatchFixture[];
    final?: TournamentMatchFixture;
  };
  champion?: TournamentTeam;
  runnerUp?: TournamentTeam;
  isEliminated: boolean;
  createdAt: number;
  updatedAt: number;
}

// Manager Profile System
export interface ManagerProfile {
  id: string;
  managerName: string;
  avatarEmoji: string;
  level: number;
  xp: number;
  stats: {
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsScored: number;
    goalsConceded: number;
    cleanSheets: number;
    trophiesWon: number;
    runnerUpCount: number;
    tournamentsPlayed: number;
  };
  trophies: Array<{
    id: string;
    tournamentName: string;
    date: number;
    type: 'gold' | 'silver';
    poolType: PoolType;
    draftMode: TournamentDraftMode;
  }>;
  recentMatches: Array<{
    opponentName: string;
    score: string;
    result: 'win' | 'loss' | 'draw';
    date: number;
    stage: string;
  }>;
}
