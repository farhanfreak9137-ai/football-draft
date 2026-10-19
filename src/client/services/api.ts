import { FormationDefinition, MatchSimulationState, RoomState, TeamEdition } from '../../shared/types/index.js';

const API_BASE = '/api';

export async function fetchFormations(): Promise<FormationDefinition[]> {
  const res = await fetch(`${API_BASE}/formations`);
  const data = await res.json();
  return data.formations;
}

export async function fetchEditions(type?: 'national' | 'club'): Promise<TeamEdition[]> {
  const url = type ? `${API_BASE}/editions?type=${type}` : `${API_BASE}/editions`;
  const res = await fetch(url);
  const data = await res.json();
  return data.editions;
}

export async function createRoom(params: {
  mode: 'solo' | 'multiplayer';
  poolType: 'national' | 'club';
  hostName: string;
  formationId?: string;
  customFormation?: FormationDefinition;
  strategy?: string;
  matchFormat?: 'auto' | 'normal' | 'knockout';
}): Promise<{ room: RoomState; hostToken: string; guestToken?: string }> {
  const res = await fetch(`${API_BASE}/rooms/create`, {
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
  const res = await fetch(`${API_BASE}/rooms/join`, {
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
  const res = await fetch(`${API_BASE}/rooms/${params.roomCode}/reconnect`, {
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
  const res = await fetch(`${API_BASE}/rooms/${params.roomCode}/pick`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.room;
}

export async function executeReroll(params: {
  roomCode: string;
  token: string;
}): Promise<RoomState> {
  const res = await fetch(`${API_BASE}/rooms/${params.roomCode}/reroll`, {
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
}): Promise<{ room: RoomState; simulation: MatchSimulationState }> {
  const res = await fetch(`${API_BASE}/rooms/${params.roomCode}/start-match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: params.token }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data;
}

export async function closeRoom(params: {
  roomCode: string;
  token: string;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/rooms/${params.roomCode}/close`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: params.token }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
}

export async function getLiveMatch(roomCode: string): Promise<MatchSimulationState | null> {
  const res = await fetch(`${API_BASE}/rooms/${roomCode}/match`);
  const data = await res.json();
  return data.success ? data.liveMatch : null;
}

