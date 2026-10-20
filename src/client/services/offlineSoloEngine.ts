import {
  DraftTurn,
  FormationDefinition,
  MatchSimulationState,
  PlayerDraftState,
  PlayerVersion,
  PoolType,
  RoomState,
  TeamEdition,
} from '../../shared/types/index.js';
import { FORMATIONS, isPlayerEligibleForSlot } from '../../shared/constants/formations.js';
import { DraftEngine } from '../../shared/engine/draftEngine.js';
import { MatchEngine } from '../../shared/engine/matchEngine.js';
import { PRNG } from '../../shared/engine/prng.js';
import soloData from '../data/soloData.json';

interface SoloDataset {
  editions: TeamEdition[];
  players: PlayerVersion[];
}

const dataset: SoloDataset = soloData as unknown as SoloDataset;

export class OfflineSoloEngine {
  private static instance: OfflineSoloEngine;
  private currentRoom: RoomState | null = null;
  private currentMatch: MatchSimulationState | null = null;
  private matchRotationCounter = 0;

  static getInstance(): OfflineSoloEngine {
    if (!OfflineSoloEngine.instance) {
      OfflineSoloEngine.instance = new OfflineSoloEngine();
    }
    return OfflineSoloEngine.instance;
  }

  isSoloRoom(roomCode?: string | null): boolean {
    if (!roomCode) return false;
    return roomCode.startsWith('SOLO-') || Boolean(this.currentRoom && this.currentRoom.roomCode === roomCode);
  }

  getEditions(type?: 'national' | 'club'): TeamEdition[] {
    if (!type) return dataset.editions;
    return dataset.editions.filter((e) => e.editionType === type);
  }

  getPlayers(): PlayerVersion[] {
    return dataset.players;
  }

  createSoloRoom(params: {
    poolType: PoolType;
    hostName: string;
    formationId?: string;
    customFormation?: FormationDefinition;
    matchFormat?: 'auto' | 'normal' | 'knockout';
  }): { room: RoomState; hostToken: string; guestToken: string } {
    const roomCode = 'SOLO-' + Math.floor(100000 + Math.random() * 900000);
    const hostToken = 'solo-host-' + Math.random().toString(36).substring(2, 10);
    const guestToken = 'solo-guest-ai';
    const now = Date.now();
    const expiresAt = now + 60 * 60 * 1000;

    const hostDraft = DraftEngine.createInitialDraftState({
      seatId: 'host',
      playerId: `player-${hostToken.slice(0, 8)}`,
      playerName: params.hostName.trim() || 'Solo Manager',
      poolType: params.poolType,
      formationId: params.formationId,
      customFormation: params.customFormation,
    });

    const soloFormations = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '3-4-3', '4-1-2-1-2'];
    const aiFormationId = soloFormations[Math.floor(Math.random() * soloFormations.length)];
    const guestDraft = DraftEngine.createInitialDraftState({
      seatId: 'guest',
      playerId: 'solo-opponent-ai',
      playerName: 'Tactical AI Challenger',
      poolType: params.poolType,
      formationId: aiFormationId,
    });

    const room: RoomState = {
      roomCode,
      status: 'drafting',
      mode: 'solo',
      poolType: params.poolType,
      matchFormat: params.matchFormat || 'auto',
      createdAt: now,
      updatedAt: now,
      expiresAt,
      hostSeat: {
        token: hostToken,
        connected: true,
        lastPing: now,
      },
      guestSeat: {
        token: guestToken,
        connected: true,
        lastPing: now,
      },
      hostDraft,
      guestDraft,
      activeTurn: 'host',
      turnDeadline: now + 40000,
      turnNumber: 1,
    };

    this.currentRoom = room;
    this.currentMatch = null;
    return { room, hostToken, guestToken };
  }

  executeRoll(params: { roomCode: string; token: string }): RoomState {
    const room = this.currentRoom;
    if (!room || room.roomCode !== params.roomCode) {
      throw new Error('Solo room not found');
    }
    if (room.status !== 'drafting') {
      throw new Error(`Cannot roll team while room status is ${room.status}`);
    }
    if (room.activeTurn !== 'host') {
      throw new Error(`It is not your turn to roll. Current turn: ${room.activeTurn}`);
    }

    const hostDraft = room.hostDraft;
    if (hostDraft.currentTeamEdition && hostDraft.currentRoster.length > 0) {
      return room;
    }

    const otherDraft = room.guestDraft!;
    const prng = new PRNG();
    const { edition, roster } = DraftEngine.rollTeamEdition(
      hostDraft,
      { editions: dataset.editions, players: dataset.players },
      prng,
      {
        excludedEditionIds: otherDraft.currentTeamEdition ? [otherDraft.currentTeamEdition.id] : [],
        excludedIdentityIds: otherDraft.usedIdentityIds || [],
      }
    );

    hostDraft.currentTeamEdition = edition;
    hostDraft.currentRoster = roster;
    room.updatedAt = Date.now();
    return room;
  }

  executeReroll(params: { roomCode: string; token: string }): RoomState {
    const room = this.currentRoom;
    if (!room || room.roomCode !== params.roomCode) {
      throw new Error('Solo room not found');
    }
    if (room.status !== 'drafting') {
      throw new Error(`Cannot reroll while room status is ${room.status}`);
    }
    if (room.activeTurn !== 'host') {
      throw new Error(`It is not your turn to reroll. Current turn: ${room.activeTurn}`);
    }

    const hostDraft = room.hostDraft;
    const otherDraft = room.guestDraft!;
    const prng = new PRNG();
    const updatedDraft = DraftEngine.executeReroll(
      hostDraft,
      { editions: dataset.editions, players: dataset.players },
      prng,
      {
        excludedEditionIds: otherDraft.currentTeamEdition ? [otherDraft.currentTeamEdition.id] : [],
        excludedIdentityIds: otherDraft.usedIdentityIds || [],
      }
    );

    room.hostDraft = updatedDraft;
    room.updatedAt = Date.now();
    return room;
  }

  executePick(params: {
    roomCode: string;
    token: string;
    playerId: string;
    slotId: string;
  }): RoomState {
    const room = this.currentRoom;
    if (!room || room.roomCode !== params.roomCode) {
      throw new Error('Solo room not found');
    }
    if (room.status !== 'drafting') {
      throw new Error(`Cannot pick while room status is ${room.status}`);
    }
    if (room.activeTurn !== 'host') {
      throw new Error(`It is not your turn. Current turn: ${room.activeTurn}`);
    }

    const hostDraft = room.hostDraft;
    const otherDraft = room.guestDraft!;

    // Fallback if not rolled yet
    if (!hostDraft.currentTeamEdition || hostDraft.currentRoster.length === 0) {
      const prng = new PRNG();
      const { edition, roster } = DraftEngine.rollTeamEdition(
        hostDraft,
        { editions: dataset.editions, players: dataset.players },
        prng,
        {
          excludedEditionIds: otherDraft.currentTeamEdition ? [otherDraft.currentTeamEdition.id] : [],
          excludedIdentityIds: otherDraft.usedIdentityIds || [],
        }
      );
      hostDraft.currentTeamEdition = edition;
      hostDraft.currentRoster = roster;
    }

    const updatedHostDraft = DraftEngine.pickPlayer(
      hostDraft,
      params.playerId,
      params.slotId,
      dataset.players,
      otherDraft.usedIdentityIds || []
    );
    room.hostDraft = updatedHostDraft;

    const pickedPlayer = dataset.players.find((p) => p.id === params.playerId);
    if (pickedPlayer) {
      room.lastPickAnnouncement = {
        seat: 'host',
        playerName: pickedPlayer.name,
        squadNumber: pickedPlayer.squadNumber,
        position: params.slotId.replace(/\d+$/, ''),
        teamEditionName: hostDraft.currentTeamEdition?.teamName,
      };
    }

    const now = Date.now();
    room.updatedAt = now;

    const hostComplete = room.hostDraft.isReady;
    const guestComplete = room.guestDraft?.isReady ?? false;

    if (hostComplete && guestComplete) {
      room.status = 'draft_complete';
      room.activeTurn = 'host';
      room.turnDeadline = 0;
      return room;
    }

    // Run AI turn immediately with 0ms delay
    this.advanceTurnToAi(room);
    return room;
  }

  private advanceTurnToAi(room: RoomState): void {
    const aiDraft = room.guestDraft!;
    if (aiDraft.isReady) {
      // AI already finished; keep turn on host
      room.activeTurn = 'host';
      room.turnNumber += 1;
      room.turnDeadline = Date.now() + 40000;
      room.hostDraft.currentTeamEdition = null;
      room.hostDraft.currentRoster = [];
      return;
    }

    room.activeTurn = 'guest';
    room.turnNumber += 1;
    const prng = new PRNG();
    const hostDraft = room.hostDraft;

    // Roll AI team edition
    const { edition, roster } = DraftEngine.rollTeamEdition(
      aiDraft,
      { editions: dataset.editions, players: dataset.players },
      prng,
      {
        excludedEditionIds: hostDraft.currentTeamEdition ? [hostDraft.currentTeamEdition.id] : [],
        excludedIdentityIds: hostDraft.usedIdentityIds || [],
      }
    );
    aiDraft.currentTeamEdition = edition;
    aiDraft.currentRoster = roster;

    // AI strategic reroll if best legal player < 84 and rerolls remaining
    const openSlots = aiDraft.formation.slots.filter((s) => !aiDraft.draftedSlots[s.id]);
    let bestLegalOvr = 0;
    for (const p of aiDraft.currentRoster) {
      if (aiDraft.usedIdentityIds.includes(p.identityId) || hostDraft.usedIdentityIds.includes(p.identityId)) continue;
      if (openSlots.some((slot) => isPlayerEligibleForSlot(p, slot))) {
        if (p.ovr > bestLegalOvr) bestLegalOvr = p.ovr;
      }
    }

    if (bestLegalOvr < 84 && aiDraft.rerollsRemaining > 0) {
      const rerolledAi = DraftEngine.executeReroll(
        aiDraft,
        { editions: dataset.editions, players: dataset.players },
        prng,
        {
          excludedEditionIds: hostDraft.currentTeamEdition ? [hostDraft.currentTeamEdition.id] : [],
          excludedIdentityIds: hostDraft.usedIdentityIds || [],
        }
      );
      room.guestDraft = rerolledAi;
    }

    // Execute deterministic AI pick
    if (room.guestDraft!.currentRoster.length > 0) {
      const auto = DraftEngine.getDeterministicAutoPick(
        room.guestDraft!,
        room.guestDraft!.currentRoster,
        hostDraft.usedIdentityIds || []
      );
      const aiUpdated = DraftEngine.pickPlayer(
        room.guestDraft!,
        auto.player.id,
        auto.slotId,
        dataset.players,
        hostDraft.usedIdentityIds || []
      );
      room.guestDraft = aiUpdated;
      room.lastPickAnnouncement = {
        seat: 'guest',
        playerName: auto.player.name,
        squadNumber: auto.player.squadNumber,
        position: auto.slotId.replace(/\d+$/, ''),
        teamEditionName: room.guestDraft!.currentTeamEdition?.teamName,
      };
    }

    // Check completion again
    if (room.hostDraft.isReady && room.guestDraft!.isReady) {
      room.status = 'draft_complete';
      room.activeTurn = 'host';
      room.turnDeadline = 0;
    } else {
      room.activeTurn = 'host';
      room.turnNumber += 1;
      room.turnDeadline = Date.now() + 40000;
      room.hostDraft.currentTeamEdition = null;
      room.hostDraft.currentRoster = [];
    }
  }

  autoPickHostIfExpired(roomCode: string): RoomState | null {
    const room = this.currentRoom;
    if (!room || room.roomCode !== roomCode || room.status !== 'drafting' || room.activeTurn !== 'host') {
      return null;
    }

    const hostDraft = room.hostDraft;
    const otherDraft = room.guestDraft!;

    if (!hostDraft.currentTeamEdition || hostDraft.currentRoster.length === 0) {
      const prng = new PRNG();
      const { edition, roster } = DraftEngine.rollTeamEdition(
        hostDraft,
        { editions: dataset.editions, players: dataset.players },
        prng,
        {
          excludedEditionIds: otherDraft.currentTeamEdition ? [otherDraft.currentTeamEdition.id] : [],
          excludedIdentityIds: otherDraft.usedIdentityIds || [],
        }
      );
      hostDraft.currentTeamEdition = edition;
      hostDraft.currentRoster = roster;
    }

    if (hostDraft.currentRoster.length > 0) {
      const autoPick = DraftEngine.getDeterministicAutoPick(
        hostDraft,
        hostDraft.currentRoster,
        otherDraft.usedIdentityIds || []
      );
      return this.executePick({
        roomCode,
        token: room.hostSeat.token,
        playerId: autoPick.player.id,
        slotId: autoPick.slotId,
      });
    }
    return room;
  }

  startMatch(params: {
    roomCode: string;
    token: string;
  }): { room: RoomState; simulation: MatchSimulationState } {
    const room = this.currentRoom;
    if (!room || room.roomCode !== params.roomCode) {
      throw new Error('Solo room not found');
    }
    if (room.status !== 'draft_complete' && room.status !== 'match_finished') {
      throw new Error(`Cannot start match while room status is ${room.status}`);
    }

    const now = Date.now();
    let isKnockout = true;
    if (room.matchFormat === 'normal') {
      isKnockout = false;
    } else if (room.matchFormat === 'knockout') {
      isKnockout = true;
    } else {
      isKnockout = this.matchRotationCounter % 2 === 1;
      this.matchRotationCounter++;
    }

    const simulation = MatchEngine.simulateMatch(room.hostDraft, room.guestDraft!, {
      knockoutMode: isKnockout,
      randomSeed: now,
    });
    simulation.startTime = now;
    simulation.status = 'live';
    simulation.knockoutMode = isKnockout;
    simulation.matchFormat = isKnockout ? 'cup' : 'league';

    this.currentMatch = simulation;
    room.status = 'simulating';
    room.matchId = simulation.matchId;
    room.updatedAt = now;

    const initialSim = MatchEngine.getAuthoritativeStateAtTime(simulation, now);
    return { room, simulation: initialSim };
  }

  getLiveMatch(roomCode: string): MatchSimulationState | null {
    if (!this.currentMatch || !this.currentRoom || this.currentRoom.roomCode !== roomCode) {
      return null;
    }
    const now = Date.now();
    const authoritative = MatchEngine.getAuthoritativeStateAtTime(this.currentMatch, now);
    if (authoritative.status === 'completed' && this.currentRoom.status === 'simulating') {
      this.currentRoom.status = 'match_finished';
      this.currentRoom.updatedAt = now;
    }
    return authoritative;
  }

  reconnectSeat(params: {
    roomCode: string;
    token: string;
  }): { seat: 'host'; room: RoomState; liveMatch: MatchSimulationState | null } {
    const room = this.currentRoom;
    if (!room || room.roomCode !== params.roomCode) {
      throw new Error('Solo room not found');
    }
    return {
      seat: 'host',
      room,
      liveMatch: this.currentMatch ? this.getLiveMatch(room.roomCode) : null,
    };
  }

  closeRoom(params: { roomCode: string; token: string }): void {
    if (this.currentRoom && this.currentRoom.roomCode === params.roomCode) {
      this.currentRoom = null;
      this.currentMatch = null;
    }
  }
}

export const offlineSoloEngine = OfflineSoloEngine.getInstance();
