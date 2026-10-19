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
}

export type Strategy = 'attacking' | 'balanced' | 'defensive';
export type PoolType = 'national' | 'club';

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
  draftedSlots: Record<string, DraftedSlot>; // slotId -> DraftedSlot
  usedIdentityIds: string[]; // Uniqueness tracker
  rerollsRemaining: number; // 2 per XI
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
  second: number; // Real second elapsed (0 to 45 for regular time)
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
  };
  description: string;
  score: {
    host: number;
    guest: number;
  };
  pitchLocation?: {
    x: number; // 0 to 100
    y: number; // 0 to 100
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
  scoreAfterKick: {
    host: number;
    guest: number;
  };
  description: string;
}

export interface MatchSimulationState {
  matchId: string;
  seed: number;
  status: 'not_started' | 'live' | 'halftime' | 'fulltime' | 'extra_time' | 'penalties' | 'completed';
  currentSecond: number; // 0 to 90 (or up to 120)
  totalDurationSeconds: number; // 90, 105, or 120
  startTime: number; // authoritative real server timestamp
  score: {
    host: number;
    guest: number;
  };
  events: MatchEvent[];
  penalties: PenaltyKickResult[];
  penaltyScore?: {
    host: number;
    guest: number;
  };
  winner?: 'host' | 'guest' | 'draw';
  winMethod?: 'regular_time' | 'extra_time' | 'penalties' | 'draw';
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

