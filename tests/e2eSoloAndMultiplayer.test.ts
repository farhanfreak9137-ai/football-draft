import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import express from 'express';
import http from 'http';
import { DatabaseService } from '../src/server/db.js';
import { RoomManager } from '../src/server/roomManager.js';
import { createApiRouter } from '../src/server/routes.js';
import { FORMATIONS } from '../src/shared/constants/formations.js';
import { DraftEngine } from '../src/shared/engine/draftEngine.js';

describe('End-to-End Game Lifecycle & Integration Tests', () => {
  let db: DatabaseService;
  let roomManager: RoomManager;
  let server: http.Server;
  let baseUrl: string;

  beforeEach(async () => {
    db = new DatabaseService();
    await db.initSchema();
    roomManager = new RoomManager(db);

    const app = express();
    app.use(express.json());
    app.use('/api', createApiRouter(roomManager, db));

    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const addr = server.address() as any;
        baseUrl = `http://127.0.0.1:${addr.port}`;
        resolve();
      });
    });
  });

  afterEach(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('verifies REST API provides all 40 editions, formations, and validation reports', async () => {
    // 1. Formations endpoint
    const formRes = await fetch(`${baseUrl}/api/formations`).then((r) => r.json());
    expect(formRes.success).toBe(true);
    expect(formRes.formations.length).toBe(4);
    expect(formRes.formations.map((f: any) => f.id)).toContain('4-3-3');
    expect(formRes.formations.map((f: any) => f.id)).toContain('4-4-2');
    expect(formRes.formations.map((f: any) => f.id)).toContain('4-2-3-1');
    expect(formRes.formations.map((f: any) => f.id)).toContain('3-5-2');

    // 2. Editions endpoint
    const editRes = await fetch(`${baseUrl}/api/editions`).then((r) => r.json());
    expect(editRes.success).toBe(true);
    expect(editRes.editions.length).toBeGreaterThanOrEqual(40);

    const natRes = await fetch(`${baseUrl}/api/editions?type=national`).then((r) => r.json());
    expect(natRes.editions.length).toBeGreaterThanOrEqual(20);

    const clubRes = await fetch(`${baseUrl}/api/editions?type=club`).then((r) => r.json());
    expect(clubRes.editions.length).toBeGreaterThanOrEqual(20);

    // 3. Validation report endpoint
    const valRes = await fetch(`${baseUrl}/api/validation-report`).then((r) => r.json());
    expect(valRes.success).toBe(true);
    expect(valRes.report.summary.status).toBe('PASSED');
    expect(valRes.report.acceptedRecords.editions).toBeGreaterThanOrEqual(40);
    expect(valRes.report.acceptedRecords.playerVersions).toBeGreaterThan(400);
  });

  it('runs complete 11-round alternating Multiplayer Draft and 90-second match simulation', async () => {
    // Step 1: Host creates multiplayer room
    const createRes = await fetch(`${baseUrl}/api/rooms/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'multiplayer',
        poolType: 'national',
        hostName: 'Host Manager',
        formationId: '4-3-3',
        strategy: 'attacking',
      }),
    }).then((r) => r.json());

    expect(createRes.success).toBe(true);
    const roomCode = createRes.room.roomCode;
    const hostToken = createRes.hostToken;

    // Step 2: Guest joins room
    const joinRes = await fetch(`${baseUrl}/api/rooms/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomCode,
        guestName: 'Guest Manager',
        formationId: '4-4-2',
        strategy: 'defensive',
      }),
    }).then((r) => r.json());

    expect(joinRes.success).toBe(true);
    const guestToken = joinRes.guestToken;
    let currentRoom = joinRes.room;
    expect(currentRoom.status).toBe('drafting');

    // Step 3: Alternate 11 rounds between Host and Guest (total 22 picks)
    for (let round = 1; round <= 11; round++) {
      // --- Host turn ---
      expect(currentRoom.activeTurn).toBe('host');

      // Host rolls team edition for their turn
      const hostRollRes = await fetch(`${baseUrl}/api/rooms/${roomCode}/roll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: hostToken }),
      }).then((r) => r.json());
      expect(hostRollRes.success).toBe(true);
      currentRoom = hostRollRes.room;

      const hostPick = DraftEngine.getDeterministicAutoPick(
        currentRoom.hostDraft,
        currentRoom.hostDraft.currentRoster,
        currentRoom.guestDraft?.usedIdentityIds || []
      );

      const hostPickRes = await fetch(`${baseUrl}/api/rooms/${roomCode}/pick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: hostToken,
          playerId: hostPick.player.id,
          slotId: hostPick.slotId,
        }),
      }).then((r) => r.json());

      expect(hostPickRes.success).toBe(true);
      currentRoom = hostPickRes.room;

      // --- Guest turn ---
      expect(currentRoom.activeTurn).toBe('guest');

      // Guest rolls team edition for their turn
      const guestRollRes = await fetch(`${baseUrl}/api/rooms/${roomCode}/roll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: guestToken }),
      }).then((r) => r.json());
      expect(guestRollRes.success).toBe(true);
      currentRoom = guestRollRes.room;

      const guestPick = DraftEngine.getDeterministicAutoPick(
        currentRoom.guestDraft!,
        currentRoom.guestDraft!.currentRoster,
        currentRoom.hostDraft.usedIdentityIds
      );

      const guestPickRes = await fetch(`${baseUrl}/api/rooms/${roomCode}/pick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: guestToken,
          playerId: guestPick.player.id,
          slotId: guestPick.slotId,
        }),
      }).then((r) => r.json());

      expect(guestPickRes.success).toBe(true);
      currentRoom = guestPickRes.room;
    }

    // Both starting XIs are fully drafted
    expect(Object.keys(currentRoom.hostDraft.draftedSlots).length).toBe(11);
    expect(Object.keys(currentRoom.guestDraft!.draftedSlots).length).toBe(11);
    expect(currentRoom.status).toBe('draft_complete');

    // Step 4: Host launches match simulation
    const startRes = await fetch(`${baseUrl}/api/rooms/${roomCode}/start-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: hostToken }),
    }).then((r) => r.json());

    expect(startRes.success).toBe(true);
    expect(startRes.simulation.status).toBe('live');
    expect(startRes.simulation.events.length).toBeGreaterThan(0);

    // Step 5: Advance authoritative clock past 90s
    const futureTime = startRes.simulation.startTime + 125 * 1000;
    const finalMatch = roomManager.getLiveMatchState(roomCode, futureTime);

    expect(finalMatch).not.toBeNull();
    expect(['completed', 'fulltime', 'penalties', 'extra_time']).toContain(finalMatch!.status);
    expect(finalMatch!.score.host).toBeGreaterThanOrEqual(0);
    expect(finalMatch!.score.guest).toBeGreaterThanOrEqual(0);
    expect(finalMatch!.events.length).toBeGreaterThanOrEqual(4);
  }, 25000);

  it('handles automatic turn timeout selection when user does not act within 40 seconds', async () => {
    const { room } = await roomManager.createRoom({
      mode: 'multiplayer',
      poolType: 'club',
      hostName: 'Slow Manager',
      formationId: '4-4-2',
      strategy: 'balanced',
    });

    await roomManager.joinRoom({
      roomCode: room.roomCode,
      guestName: 'Guest',
      formationId: '4-4-2',
      strategy: 'balanced',
    });

    const initialRoom = (await db.getRoom(room.roomCode))!;
    expect(Object.keys(initialRoom.hostDraft.draftedSlots).length).toBe(0);

    // Simulate clock passing 40s deadline and call tickTurnTimers
    const expiredTime = initialRoom.turnDeadline + 1000;
    const expiredRooms = await roomManager.tickTurnTimers(expiredTime);

    expect(expiredRooms).toContain(room.roomCode);

    const updatedRoom = (await db.getRoom(room.roomCode))!;
    // Host auto-picked 1 player based on deterministic tie-break
    expect(Object.keys(updatedRoom.hostDraft.draftedSlots).length).toBe(1);
    expect(updatedRoom.activeTurn).toBe('guest');
  });

  it('supports seamless reconnection for active rooms and match state', async () => {
    const { room, hostToken } = await roomManager.createRoom({
      mode: 'solo',
      poolType: 'national',
      hostName: 'Reconnecting Manager',
      formationId: '4-3-3',
      strategy: 'defensive',
    });

    // Reconnect with valid token
    const res = await fetch(`${baseUrl}/api/rooms/${room.roomCode}/reconnect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: hostToken }),
    }).then((r) => r.json());

    expect(res.success).toBe(true);
    expect(res.seat).toBe('host');
    expect(res.room.roomCode).toBe(room.roomCode);

    // Reject reconnect with invalid token
    const badRes = await fetch(`${baseUrl}/api/rooms/${room.roomCode}/reconnect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'bogus-token' }),
    }).then((r) => r.json());

    expect(badRes.success).toBe(false);
  });
});
