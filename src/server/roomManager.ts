import crypto from 'crypto';
import {
  DraftTurn,
  MatchSimulationState,
  PlayerDraftState,
  PoolType,
  RoomState,
} from '../shared/types/index.js';
import { FORMATIONS } from '../shared/constants/formations.js';
import { DraftEngine } from '../shared/engine/draftEngine.js';
import { MatchEngine } from '../shared/engine/matchEngine.js';
import { PRNG } from '../shared/engine/prng.js';
import { DatabaseService } from './db.js';

export class RoomManager {
  private db: DatabaseService;
  private matches: Map<string, MatchSimulationState> = new Map();
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
    if (!currentDraft.currentTeamEdition) {
      throw new Error('No team edition currently rolled for this turn');
    }

    // Execute pick
    const updatedDraft = DraftEngine.pickPlayer(
      currentDraft,
      params.playerId,
      params.slotId,
      this.db.players
    );

    if (seat === 'host') {
      room.hostDraft = updatedDraft;
    } else {
      room.guestDraft = updatedDraft;
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
    const prng = new PRNG();
    const updatedDraft = DraftEngine.executeReroll(
      currentDraft,
      { editions: this.db.editions, players: this.db.players },
      prng
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
      if (!currentDraft.isReady) {
        // Roll new team for current player
        const prng = new PRNG();
        const { edition, roster } = DraftEngine.rollTeamEdition(
          currentDraft,
          { editions: this.db.editions, players: this.db.players },
          prng
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
    const prng = new PRNG();
    const { edition, roster } = DraftEngine.rollTeamEdition(
      nextDraft,
      { editions: this.db.editions, players: this.db.players },
      prng
    );
    nextDraft.currentTeamEdition = edition;
    nextDraft.currentRoster = roster;

    // Handle Solo Mode AI turn automatically
    if (room.mode === 'solo' && nextTurn === 'guest') {
      await this.db.saveRoom(room);
      this.onRoomUpdated?.(room);
      // Execute AI turn immediately with a realistic short thinking delay
      setTimeout(async () => {
        try {
          const freshRoom = await this.db.getRoom(room.roomCode);
          if (freshRoom && freshRoom.status === 'drafting' && freshRoom.activeTurn === 'guest') {
            const aiDraft = freshRoom.guestDraft!;
            if (aiDraft.currentRoster.length > 0) {
              const auto = DraftEngine.getDeterministicAutoPick(aiDraft, aiDraft.currentRoster);
              await this.executePick({
                roomCode: freshRoom.roomCode,
                token: freshRoom.guestSeat!.token,
                playerId: auto.player.id,
                slotId: auto.slotId,
              });
            }
          }
        } catch (err) {
          console.error('Error executing solo AI turn:', err);
        }
      }, 500);
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
          if (activeDraft.currentRoster.length > 0) {
            const autoPick = DraftEngine.getDeterministicAutoPick(
              activeDraft,
              activeDraft.currentRoster
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
    const simulation = MatchEngine.simulateMatch(room.hostDraft, room.guestDraft, {
      knockoutMode: true,
      randomSeed: now,
    });
    simulation.startTime = now;
    simulation.status = 'live';

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
