import crypto from 'crypto';
import {
  DraftTurn,
  FormationDefinition,
  MatchSimulationState,
  PlayerDraftState,
  PoolType,
  RoomState,
} from '../shared/types/index.js';
import { FORMATIONS, isPlayerEligibleForSlot } from '../shared/constants/formations.js';
import { DraftEngine } from '../shared/engine/draftEngine.js';
import { MatchEngine } from '../shared/engine/matchEngine.js';
import { PRNG } from '../shared/engine/prng.js';
import { DatabaseService } from './db.js';

export class RoomManager {
  private db: DatabaseService;
  private matches: Map<string, MatchSimulationState> = new Map();
  private matchRotationCounter = 0;
  public onRoomUpdated?: (room: RoomState) => void;

  constructor(db: DatabaseService) {
    this.db = db;
  }

  private generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private generateToken(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  async createRoom(params: {
    mode: 'solo' | 'multiplayer';
    poolType: PoolType;
    hostName: string;
    formationId?: string;
    customFormation?: FormationDefinition;
    matchFormat?: 'auto' | 'normal' | 'knockout';
  }): Promise<{ room: RoomState; hostToken: string; guestToken?: string }> {
    const roomCode = this.generateRoomCode();
    const hostToken = this.generateToken();
    const now = Date.now();
    const expiresAt = now + 60 * 60 * 1000; // 1 hour expiration

    const hostDraft = DraftEngine.createInitialDraftState({
      seatId: 'host',
      playerId: `player-${hostToken.slice(0, 8)}`,
      playerName: params.hostName.trim() || 'Host Manager',
      poolType: params.poolType,
      formationId: params.formationId,
      customFormation: params.customFormation,
    });

    let guestDraft: PlayerDraftState | undefined;
    let guestToken: string | undefined;

    if (params.mode === 'solo') {
      guestToken = this.generateToken();
      // For solo mode, choose a balanced AI formation
      const soloFormations = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2'];
      const aiFormationId = soloFormations[Math.floor(Math.random() * soloFormations.length)];
      guestDraft = DraftEngine.createInitialDraftState({
        seatId: 'guest',
        playerId: 'solo-opponent-ai',
        playerName: 'Tactical AI Challenger',
        poolType: params.poolType,
        formationId: aiFormationId,
      });
    }

    const room: RoomState = {
      roomCode,
      status: params.mode === 'solo' ? 'drafting' : 'lobby',
      mode: params.mode,
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
      guestSeat: guestToken
        ? {
            token: guestToken,
            connected: true,
            lastPing: now,
          }
        : undefined,
      hostDraft,
      guestDraft,
      activeTurn: 'host',
      turnDeadline: now + 40000, // 40 seconds
      turnNumber: 1,
    };

    // If starting immediately in solo mode, roll initial team edition for host
    if (params.mode === 'solo') {
      const prng = new PRNG();
      const { edition, roster } = DraftEngine.rollTeamEdition(
        room.hostDraft,
        { editions: this.db.editions, players: this.db.players },
        prng
      );
      room.hostDraft.currentTeamEdition = edition;
      room.hostDraft.currentRoster = roster;
    }

    await this.db.saveRoom(room);
    return { room, hostToken, guestToken };
  }

  async joinRoom(params: {
    roomCode: string;
    guestName: string;
    formationId?: string;
    customFormation?: FormationDefinition;
  }): Promise<{ room: RoomState; guestToken: string }> {
    const room = await this.db.getRoom(params.roomCode.toUpperCase());
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.status !== 'lobby') {
      throw new Error(`Room is not accepting new guests (status: ${room.status})`);
    }

    if (room.guestSeat) {
      throw new Error('Room guest seat is already occupied');
    }

    const guestToken = this.generateToken();
    const now = Date.now();

    const guestDraft = DraftEngine.createInitialDraftState({
      seatId: 'guest',
      playerId: `player-${guestToken.slice(0, 8)}`,
      playerName: params.guestName.trim() || 'Challenger',
      poolType: room.poolType,
      formationId: params.formationId,
      customFormation: params.customFormation,
    });

    room.guestSeat = {
      token: guestToken,
      connected: true,
      lastPing: now,
    };
    room.guestDraft = guestDraft;
    room.status = 'drafting';
    room.updatedAt = now;
    room.activeTurn = 'host';
    room.turnDeadline = now + 40000; // 40 seconds

    // Roll initial team for host
    const prng = new PRNG();
    const { edition, roster } = DraftEngine.rollTeamEdition(
      room.hostDraft,
      { editions: this.db.editions, players: this.db.players },
      prng
    );
    room.hostDraft.currentTeamEdition = edition;
    room.hostDraft.currentRoster = roster;

    await this.db.saveRoom(room);
    return { room, guestToken };
  }

  async authenticateSeat(
    roomCode: string,
    token: string
  ): Promise<{ seat: 'host' | 'guest'; room: RoomState } | null> {
    const room = await this.db.getRoom(roomCode.toUpperCase());
    if (!room) return null;

    if (room.hostSeat.token === token) {
      room.hostSeat.connected = true;
      room.hostSeat.lastPing = Date.now();
      await this.db.saveRoom(room);
      return { seat: 'host', room };
    }

    if (room.guestSeat && room.guestSeat.token === token) {
      room.guestSeat.connected = true;
      room.guestSeat.lastPing = Date.now();
      await this.db.saveRoom(room);
      return { seat: 'guest', room };
    }

    return null;
  }

  async executePick(params: {
    roomCode: string;
    token: string;
    playerId: string;
    slotId: string;
  }): Promise<RoomState> {
    const auth = await this.authenticateSeat(params.roomCode, params.token);
    if (!auth) {
      throw new Error('UNAUTHORIZED_SEAT_TOKEN');
    }

    const { seat, room } = auth;
    if (room.status !== 'drafting') {
      throw new Error(`Cannot pick while room status is ${room.status}`);
    }

    if (room.activeTurn !== seat) {
      throw new Error(`It is not your turn. Current turn: ${room.activeTurn}`);
    }

    const currentDraft = seat === 'host' ? room.hostDraft : room.guestDraft!;
    const otherDraft = seat === 'host' ? room.guestDraft : room.hostDraft;
    if (!currentDraft.currentTeamEdition) {
      throw new Error('No team edition currently rolled for this turn');
    }

    // Execute pick with cross-team uniqueness check (22 unique players rule)
    const updatedDraft = DraftEngine.pickPlayer(
      currentDraft,
      params.playerId,
      params.slotId,
      this.db.players,
      otherDraft?.usedIdentityIds || []
    );

    if (seat === 'host') {
      room.hostDraft = updatedDraft;
    } else {
      room.guestDraft = updatedDraft;
    }

    const pickedPlayer = this.db.players.find((p) => p.id === params.playerId);
    if (pickedPlayer) {
      room.lastPickAnnouncement = {
        seat,
        playerName: pickedPlayer.name,
        squadNumber: pickedPlayer.squadNumber,
        position: params.slotId.replace(/\d+$/, ''),
        teamEditionName: currentDraft.currentTeamEdition?.teamName,
      };
    }

    // Check if both teams are finished drafting (11 slots filled)
    const hostComplete = room.hostDraft.isReady;
    const guestComplete = room.guestDraft?.isReady ?? false;

    const now = Date.now();
    room.updatedAt = now;

    if (hostComplete && guestComplete) {
      room.status = 'draft_complete';
      room.activeTurn = 'host';
      room.turnDeadline = 0;
      await this.db.saveRoom(room);
      this.onRoomUpdated?.(room);
      return room;
    }

    // Advance turn to next seat
    await this.advanceTurn(room);
    this.onRoomUpdated?.(room);
    return room;
  }

  async executeReroll(params: {
    roomCode: string;
    token: string;
  }): Promise<RoomState> {
    const auth = await this.authenticateSeat(params.roomCode, params.token);
    if (!auth) {
      throw new Error('UNAUTHORIZED_SEAT_TOKEN');
    }

    const { seat, room } = auth;
    if (room.status !== 'drafting') {
      throw new Error(`Cannot reroll while room status is ${room.status}`);
    }

    if (room.activeTurn !== seat) {
      throw new Error(`It is not your turn. Current turn: ${room.activeTurn}`);
    }

    const currentDraft = seat === 'host' ? room.hostDraft : room.guestDraft!;
    const otherDraft = seat === 'host' ? room.guestDraft : room.hostDraft;
    const prng = new PRNG();
    const updatedDraft = DraftEngine.executeReroll(
      currentDraft,
      { editions: this.db.editions, players: this.db.players },
      prng,
      {
        excludedEditionIds: otherDraft?.currentTeamEdition ? [otherDraft.currentTeamEdition.id] : [],
        excludedIdentityIds: otherDraft?.usedIdentityIds || [],
      }
    );

    if (seat === 'host') {
      room.hostDraft = updatedDraft;
    } else {
      room.guestDraft = updatedDraft;
    }

    room.updatedAt = Date.now();
    await this.db.saveRoom(room);
    this.onRoomUpdated?.(room);
    return room;
  }

  private async advanceTurn(room: RoomState): Promise<void> {
    const nextTurn: DraftTurn = room.activeTurn === 'host' ? 'guest' : 'host';
    const nextDraft = nextTurn === 'host' ? room.hostDraft : room.guestDraft;

    if (!nextDraft) {
      throw new Error('Next draft state is missing');
    }

    // If next player has already completed their XI, keep turn on current if they still have open slots
    if (nextDraft.isReady) {
      const currentDraft = room.activeTurn === 'host' ? room.hostDraft : room.guestDraft!;
      const otherDraft = room.activeTurn === 'host' ? room.guestDraft : room.hostDraft;
      if (!currentDraft.isReady) {
        // Roll new team for current player
        const prng = new PRNG();
        const { edition, roster } = DraftEngine.rollTeamEdition(
          currentDraft,
          { editions: this.db.editions, players: this.db.players },
          prng,
          {
            excludedEditionIds: otherDraft?.currentTeamEdition ? [otherDraft.currentTeamEdition.id] : [],
            excludedIdentityIds: otherDraft?.usedIdentityIds || [],
          }
        );
        currentDraft.currentTeamEdition = edition;
        currentDraft.currentRoster = roster;
        room.turnDeadline = Date.now() + 40000;
        await this.db.saveRoom(room);
        this.onRoomUpdated?.(room);
        return;
      }
    }

    room.activeTurn = nextTurn;
    room.turnNumber += 1;
    const now = Date.now();
    room.turnDeadline = now + 40000; // 40 seconds

    // Roll new team edition for the new active player
    const otherDraft = nextTurn === 'host' ? room.guestDraft : room.hostDraft;
    const prng = new PRNG();
    const { edition, roster } = DraftEngine.rollTeamEdition(
      nextDraft,
      { editions: this.db.editions, players: this.db.players },
      prng,
      {
        excludedEditionIds: otherDraft?.currentTeamEdition ? [otherDraft.currentTeamEdition.id] : [],
        excludedIdentityIds: otherDraft?.usedIdentityIds || [],
      }
    );
    nextDraft.currentTeamEdition = edition;
    nextDraft.currentRoster = roster;

    // Handle Solo Mode AI turn automatically (equal odds and human-like strategy)
    if (room.mode === 'solo' && nextTurn === 'guest') {
      await this.db.saveRoom(room);
      this.onRoomUpdated?.(room);
      // Execute AI turn with a realistic human-like thinking delay
      setTimeout(async () => {
        try {
          const freshRoom = await this.db.getRoom(room.roomCode);
          if (freshRoom && freshRoom.status === 'drafting' && freshRoom.activeTurn === 'guest') {
            let aiDraft = freshRoom.guestDraft!;
            const hostUsedIdentities = freshRoom.hostDraft?.usedIdentityIds || [];
            if (aiDraft.currentRoster.length > 0) {
              // Strategic AI: Calculate best legal OVR available in current rolled roster
              const openSlots = aiDraft.formation.slots.filter(
                (s) => !aiDraft.draftedSlots[s.id]
              );
              let bestLegalOvr = 0;
              for (const p of aiDraft.currentRoster) {
                if (aiDraft.usedIdentityIds.includes(p.identityId) || hostUsedIdentities.includes(p.identityId)) continue;
                if (openSlots.some((slot) => isPlayerEligibleForSlot(p, slot))) {
                  if (p.ovr > bestLegalOvr) bestLegalOvr = p.ovr;
                }
              }

              // Equal odds: AI can reroll up to 2 times if rolled roster lacks high-impact players (< 84)
              if (bestLegalOvr < 84 && aiDraft.rerollsRemaining > 0) {
                const rerolledRoom = await this.executeReroll({
                  roomCode: freshRoom.roomCode,
                  token: freshRoom.guestSeat!.token,
                });
                aiDraft = rerolledRoom.guestDraft!;
              }

              if (aiDraft.currentRoster.length > 0) {
                const auto = DraftEngine.getDeterministicAutoPick(
                  aiDraft,
                  aiDraft.currentRoster,
                  freshRoom.hostDraft?.usedIdentityIds || []
                );
                await this.executePick({
                  roomCode: freshRoom.roomCode,
                  token: freshRoom.guestSeat!.token,
                  playerId: auto.player.id,
                  slotId: auto.slotId,
                });
              }
            }
          }
        } catch (err) {
          console.error('Error executing solo AI turn:', err);
        }
      }, 750);
      return;
    }

    await this.db.saveRoom(room);
    this.onRoomUpdated?.(room);
  }

  /**
   * Authoritative timer tick called every second:
   * Checks turn deadlines for all drafting rooms.
   * If expired: deterministic auto-pick is executed.
   */
  async tickTurnTimers(now: number): Promise<string[]> {
    const expiredRoomCodes: string[] = [];
    const activeRooms = this.db.getAllActiveRooms();

    for (const room of activeRooms) {
      if (room.status === 'drafting' && room.turnDeadline > 0 && now >= room.turnDeadline) {
        try {
          const activeDraft = room.activeTurn === 'host' ? room.hostDraft : room.guestDraft!;
          const otherDraft = room.activeTurn === 'host' ? room.guestDraft : room.hostDraft;
          if (activeDraft.currentRoster.length > 0) {
            const autoPick = DraftEngine.getDeterministicAutoPick(
              activeDraft,
              activeDraft.currentRoster,
              otherDraft?.usedIdentityIds || []
            );
            const token =
              room.activeTurn === 'host' ? room.hostSeat.token : room.guestSeat!.token;
            await this.executePick({
              roomCode: room.roomCode,
              token,
              playerId: autoPick.player.id,
              slotId: autoPick.slotId,
            });
            expiredRoomCodes.push(room.roomCode);
          }
        } catch (err) {
          console.error(`Error auto-picking for room ${room.roomCode}:`, err);
        }
      }
    }

    return expiredRoomCodes;
  }

  async startMatch(params: {
    roomCode: string;
    token: string;
  }): Promise<{ room: RoomState; simulation: MatchSimulationState }> {
    const auth = await this.authenticateSeat(params.roomCode, params.token);
    if (!auth) {
      throw new Error('UNAUTHORIZED_SEAT_TOKEN');
    }

    const { room } = auth;
    if (room.status !== 'draft_complete' && room.status !== 'match_finished') {
      throw new Error(`Cannot start match while room status is ${room.status}`);
    }

    if (!room.guestDraft) {
      throw new Error('Guest draft is missing');
    }

    const now = Date.now();
    let isKnockout = true;
    if (room.matchFormat === 'normal') {
      isKnockout = false;
    } else if (room.matchFormat === 'knockout') {
      isKnockout = true;
    } else {
      // 'auto' mode: rotates between Normal Time (League) and Knockout (Cup)
      isKnockout = this.matchRotationCounter % 2 === 1;
      this.matchRotationCounter++;
    }

    const simulation = MatchEngine.simulateMatch(room.hostDraft, room.guestDraft, {
      knockoutMode: isKnockout,
      randomSeed: now,
    });
    simulation.startTime = now;
    simulation.status = 'live';
    simulation.knockoutMode = isKnockout;
    simulation.matchFormat = isKnockout ? 'cup' : 'league';

    this.matches.set(room.roomCode, simulation);
    room.status = 'simulating';
    room.matchId = simulation.matchId;
    room.updatedAt = now;

    await this.db.saveRoom(room);
    const initialSim = MatchEngine.getAuthoritativeStateAtTime(simulation, now);
    return { room, simulation: initialSim };
  }

  getLiveMatchState(roomCode: string, now: number): MatchSimulationState | null {
    const sim = this.matches.get(roomCode.toUpperCase());
    if (!sim) return null;
    return MatchEngine.getAuthoritativeStateAtTime(sim, now);
  }

  async closeRoom(params: { roomCode: string; token: string }): Promise<void> {
    const room = await this.db.getRoom(params.roomCode.toUpperCase());
    if (!room) return;

    const isHost = room.hostSeat.token === params.token;
    const isGuest = room.guestSeat && room.guestSeat.token === params.token;
    if (!isHost && !isGuest) {
      throw new Error('Invalid token for room closure');
    }

    room.status = 'closed';
    this.matches.delete(room.roomCode);
    await this.db.deleteRoom(room.roomCode);
  }
}
