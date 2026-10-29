import {
  FormationDefinition,
  LiveMentality,
  DefensiveStyle,
  PassingStyle,
  TouchlineShout,
  MatchSimulationState,
  PlayerDraftState,
  PlayerVersion,
  PoolType,
  RoomState,
  TeamEdition,
  HistoricalScenario,
} from '../../shared/types/index.js';
import { FORMATIONS } from '../../shared/constants/formations.js';
import { offlineSoloEngine } from './offlineSoloEngine.js';

const STORAGE_KEY_SERVER_URL = 'hfd_server_url';
export const DEFAULT_ONLINE_SERVER = 'https://football-draft-08nh.onrender.com';

export function getServerUrl(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SERVER_URL);
    if (saved && saved.trim()) return saved.trim().replace(/\/+$/, '');
  } catch (e) {}

  // In native Android Capacitor environment (capacitor:// or file://), point to cloud backend by default
  if (
    typeof window !== 'undefined' &&
    (window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'file:' ||
      (window.location.hostname === 'localhost' && !window.location.port))
  ) {
    return DEFAULT_ONLINE_SERVER;
  }

  // In regular web browser, use relative path (same origin)
  return '';
}

export function setServerUrl(url: string): void {
  try {
    const clean = url.trim().replace(/\/+$/, '');
    if (!clean) {
      localStorage.removeItem(STORAGE_KEY_SERVER_URL);
    } else {
      localStorage.setItem(STORAGE_KEY_SERVER_URL, clean);
    }
  } catch (e) {}
}

export async function pingServer(targetUrl?: string): Promise<{ success: boolean; latencyMs?: number; activeRooms?: number; error?: string }> {
  const base = (targetUrl !== undefined ? targetUrl : getServerUrl()).replace(/\/+$/, '');
  const start = Date.now();
  try {
    const res = await fetch(`${base}/api/health`, { method: 'GET' });
    const data = await res.json();
    const latencyMs = Date.now() - start;
    if (data.status === 'healthy') {
      return { success: true, latencyMs, activeRooms: data.activeRooms };
    }
    return { success: false, error: 'Server returned unhealthy status' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Connection failed' };
  }
}

function getApiBase(): string {
  const base = getServerUrl();
  return `${base}/api`;
}

export async function fetchFormations(): Promise<FormationDefinition[]> {
  try {
    const res = await fetch(`${getApiBase()}/formations`);
    const data = await res.json();
    if (data.success && Array.isArray(data.formations)) {
      return data.formations;
    }
  } catch (e) {
    // Offline fallback to bundled formations
  }
  return Object.values(FORMATIONS);
}

export async function fetchEditions(type?: 'national' | 'club'): Promise<TeamEdition[]> {
  try {
    const url = type ? `${getApiBase()}/editions?type=${type}` : `${getApiBase()}/editions`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.success && Array.isArray(data.editions) && data.editions.length > 0) {
      return data.editions;
    }
  } catch (e) {
    // Offline fallback to local bundled database
  }
  return offlineSoloEngine.getEditions(type);
}

export async function createRoom(params: {
  mode: 'solo' | 'multiplayer';
  poolType: 'national' | 'club';
  hostName: string;
  formationId?: string;
  customFormation?: FormationDefinition;
  strategy?: string;
  matchFormat?: 'auto' | 'normal' | 'knockout';
  enableSubstitutions?: boolean;
}): Promise<{ room: RoomState; hostToken: string; guestToken?: string }> {
  // If solo mode, route 100% offline with 0ms latency
  if (params.mode === 'solo') {
    const result = offlineSoloEngine.createSoloRoom(params);
    return {
      room: result.room,
      hostToken: result.hostToken,
      guestToken: result.guestToken,
    };
  }

  // Multiplayer mode routes to remote server
  const res = await fetch(`${getApiBase()}/rooms/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data;
}

export async function joinRoom(params: {
  roomCode: string;
  guestName: string;
  formationId?: string;
  customFormation?: FormationDefinition;
}): Promise<{ room: RoomState; guestToken: string }> {
  const res = await fetch(`${getApiBase()}/rooms/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data;
}

export async function reconnectSeat(params: {
  roomCode: string;
  token: string;
}): Promise<{ seat: 'host' | 'guest'; room: RoomState; liveMatch: MatchSimulationState | null }> {
  if (offlineSoloEngine.isSoloRoom(params.roomCode)) {
    return offlineSoloEngine.reconnectSeat(params);
  }

  const res = await fetch(`${getApiBase()}/rooms/${params.roomCode}/reconnect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: params.token }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data;
}

export async function executePick(params: {
  roomCode: string;
  token: string;
  playerId: string;
  slotId: string;
}): Promise<RoomState> {
  if (offlineSoloEngine.isSoloRoom(params.roomCode)) {
    return offlineSoloEngine.executePick(params);
  }

  const res = await fetch(`${getApiBase()}/rooms/${params.roomCode}/pick`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.room;
}

export async function executeRoll(params: {
  roomCode: string;
  token: string;
}): Promise<RoomState> {
  if (offlineSoloEngine.isSoloRoom(params.roomCode)) {
    return offlineSoloEngine.executeRoll(params);
  }

  const res = await fetch(`${getApiBase()}/rooms/${params.roomCode}/roll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: params.token }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.room;
}

export async function executeReroll(params: {
  roomCode: string;
  token: string;
}): Promise<RoomState> {
  if (offlineSoloEngine.isSoloRoom(params.roomCode)) {
    return offlineSoloEngine.executeReroll(params);
  }

  const res = await fetch(`${getApiBase()}/rooms/${params.roomCode}/reroll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: params.token }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.room;
}

export async function startMatch(params: {
  roomCode: string;
  token: string;
  matchDurationSec?: number;
}): Promise<{ room: RoomState; simulation: MatchSimulationState }> {
  if (offlineSoloEngine.isSoloRoom(params.roomCode)) {
    return offlineSoloEngine.startMatch(params);
  }

  const res = await fetch(`${getApiBase()}/rooms/${params.roomCode}/start-match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: params.token, matchDurationSec: params.matchDurationSec }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data;
}

export function createPrebuiltMatch(params: {
  hostDraft: PlayerDraftState;
  guestDraft: PlayerDraftState;
  matchDurationSec?: number;
  isKnockout?: boolean;
  poolType?: PoolType;
}): { room: RoomState; simulation: MatchSimulationState } {
  return offlineSoloEngine.createPrebuiltMatch(params);
}

export function updateLiveMentality(
  roomCode: string,
  mentality: LiveMentality,
  team: 'host' | 'guest' = 'host'
): MatchSimulationState | null {
  if (offlineSoloEngine.isSoloRoom(roomCode)) {
    return offlineSoloEngine.updateLiveMentality(mentality, team);
  }
  return null;
}

export function updateLiveTactics(
  roomCode: string,
  tactics: {
    mentality?: LiveMentality;
    defensiveStyle?: DefensiveStyle;
    passingStyle?: PassingStyle;
    shout?: TouchlineShout;
  },
  team: 'host' | 'guest' = 'host'
): MatchSimulationState | null {
  if (offlineSoloEngine.isSoloRoom(roomCode)) {
    return offlineSoloEngine.updateLiveTactics(tactics, team);
  }
  return null;
}

export function makeSubstitution(
  roomCode: string,
  slotId: string,
  subPlayer: PlayerVersion,
  team: 'host' | 'guest' = 'host'
): MatchSimulationState | null {
  if (offlineSoloEngine.isSoloRoom(roomCode)) {
    return offlineSoloEngine.makeSubstitution(slotId, subPlayer, team);
  }
  return null;
}

export function createScenarioMatch(
  scenario: HistoricalScenario
): { room: RoomState; simulation: MatchSimulationState } {
  return offlineSoloEngine.createScenarioMatch(scenario);
}

export async function closeRoom(params: {
  roomCode: string;
  token: string;
}): Promise<void> {
  if (offlineSoloEngine.isSoloRoom(params.roomCode)) {
    offlineSoloEngine.closeRoom(params);
    return;
  }

  const res = await fetch(`${getApiBase()}/rooms/${params.roomCode}/close`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: params.token }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
}

export async function getLiveMatch(roomCode: string): Promise<MatchSimulationState | null> {
  if (offlineSoloEngine.isSoloRoom(roomCode)) {
    return offlineSoloEngine.getLiveMatch(roomCode);
  }

  const res = await fetch(`${getApiBase()}/rooms/${roomCode}/match`);
  const data = await res.json();
  return data.success ? data.liveMatch : null;
}

export async function requestRematch(params: {
  roomCode: string;
  token: string;
}): Promise<{ room: RoomState }> {
  if (offlineSoloEngine.isSoloRoom(params.roomCode)) {
    return offlineSoloEngine.requestRematch(params);
  }

  const res = await fetch(`${getApiBase()}/rooms/${params.roomCode}/rematch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: params.token, action: 'request' }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data;
}

export async function respondRematch(params: {
  roomCode: string;
  token: string;
  accept: boolean;
}): Promise<{ room: RoomState }> {
  if (offlineSoloEngine.isSoloRoom(params.roomCode)) {
    return offlineSoloEngine.requestRematch(params);
  }

  const res = await fetch(`${getApiBase()}/rooms/${params.roomCode}/rematch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: params.token,
      action: params.accept ? 'accept' : 'decline',
    }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data;
}

export async function cancelRematch(params: {
  roomCode: string;
  token: string;
}): Promise<{ room: RoomState }> {
  if (offlineSoloEngine.isSoloRoom(params.roomCode)) {
    return { room: (offlineSoloEngine as any).currentRoom };
  }

  const res = await fetch(`${getApiBase()}/rooms/${params.roomCode}/rematch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: params.token, action: 'cancel' }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data;
}
