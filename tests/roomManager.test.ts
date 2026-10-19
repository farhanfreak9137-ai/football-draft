import { describe, it, expect, beforeEach } from 'vitest';
import { RoomManager } from '../src/server/roomManager.js';
import { DatabaseService } from '../src/server/db.js';

describe('RoomManager & Multiplayer Security', () => {
  let db: DatabaseService;
  let rm: RoomManager;

  beforeEach(async () => {
    db = new DatabaseService();
    await db.initSchema();
    rm = new RoomManager(db);
  });

  it('creates private room with distinct room code and private host token', async () => {
    const { room, hostToken } = await rm.createRoom({
      mode: 'multiplayer',
      poolType: 'national',
      hostName: 'Host Manager',
      formationId: '4-3-3',
    });

    expect(room.roomCode.length).toBe(6);
    expect(hostToken).toBeDefined();
    expect(room.hostSeat.token).toBe(hostToken);
    expect(room.status).toBe('lobby');
    expect(room.guestSeat).toBeUndefined();

    // Verify room code alone does not grant host access without private token
    const fakeAuth = await rm.authenticateSeat(room.roomCode, 'invalid-token');
    expect(fakeAuth).toBeNull();

    // Valid token restores seat
    const auth = await rm.authenticateSeat(room.roomCode, hostToken);
    expect(auth).not.toBeNull();
    expect(auth?.seat).toBe('host');
  });

  it('enforces strict alternating turn order (Host -> Guest -> Host)', async () => {
    const { room: initialRoom, hostToken } = await rm.createRoom({
      mode: 'multiplayer',
      poolType: 'national',
      hostName: 'Host Manager',
    });

    const { room: activeRoom, guestToken } = await rm.joinRoom({
      roomCode: initialRoom.roomCode,
      guestName: 'Guest Manager',
    });

    expect(activeRoom.status).toBe('drafting');
    expect(activeRoom.activeTurn).toBe('host'); // Host always goes first

    // Guest attempting to pick out of turn MUST be rejected
    const guestRoster = activeRoom.hostDraft.currentRoster;
    await expect(
      rm.executePick({
        roomCode: activeRoom.roomCode,
        token: guestToken,
        playerId: guestRoster[0].id,
        slotId: 'gk',
      })
    ).rejects.toThrow(/not your turn/i);

    // Host picks a legal player for an eligible slot
    const hostPlayer = activeRoom.hostDraft.currentRoster.find((p) => p.naturalPositions.includes('GK')) || activeRoom.hostDraft.currentRoster[0];
    const slotId = activeRoom.hostDraft.formation.slots.find((s) => s.defaultPosition === hostPlayer.naturalPositions[0])?.id || 'st';

    const afterHostPick = await rm.executePick({
      roomCode: activeRoom.roomCode,
      token: hostToken,
      playerId: hostPlayer.id,
      slotId,
    });

    // Turn strictly alternates to guest
    expect(afterHostPick.activeTurn).toBe('guest');

    // Host attempting to pick again immediately MUST be rejected (duplicate-click protection)
    await expect(
      rm.executePick({
        roomCode: activeRoom.roomCode,
        token: hostToken,
        playerId: hostPlayer.id,
        slotId: 'cb1',
      })
    ).rejects.toThrow(/not your turn/i);
  });

  it('triggers deterministic auto-pick upon 40-second turn expiry', async () => {
    const { room: initialRoom } = await rm.createRoom({
      mode: 'multiplayer',
      poolType: 'national',
      hostName: 'Host Manager',
    });

    const { room } = await rm.joinRoom({
      roomCode: initialRoom.roomCode,
      guestName: 'Guest Manager',
    });

    expect(Object.keys(room.hostDraft.draftedSlots).length).toBe(0);

    // Fast-forward time past 40 seconds deadline
    const expiredTimestamp = room.turnDeadline + 1000;
    const timedOutRooms = await rm.tickTurnTimers(expiredTimestamp);

    expect(timedOutRooms).toContain(room.roomCode);

    const freshRoom = await db.getRoom(room.roomCode);
    // Host should now have 1 slot automatically drafted with highest-OVR legal player
    expect(Object.keys(freshRoom!.hostDraft.draftedSlots).length).toBe(1);
    // Turn should have advanced to guest
    expect(freshRoom!.activeTurn).toBe('guest');
  });

  it('handles secure reconnection and restores seat, squad, and timer', async () => {
    const { room, hostToken } = await rm.createRoom({
      mode: 'solo',
      poolType: 'club',
      hostName: 'Solo Host',
    });

    // Simulate browser refresh/reconnect
    const reconnected = await rm.authenticateSeat(room.roomCode, hostToken);
    expect(reconnected).not.toBeNull();
    expect(reconnected?.seat).toBe('host');
    expect(reconnected?.room.roomCode).toBe(room.roomCode);
    expect(reconnected?.room.status).toBe('drafting');
    expect(reconnected?.room.hostDraft.currentTeamEdition).toBeDefined();
  });

  it('allows host to close room and cleans up 1-hour abandoned rooms', async () => {
    const { room, hostToken, guestToken } = await rm.createRoom({
      mode: 'multiplayer',
      poolType: 'national',
      hostName: 'Host',
    });

    // Guest cannot close room
    await expect(
      rm.closeRoom({ roomCode: room.roomCode, token: 'invalid' })
    ).rejects.toThrow();

    // Host closes room
    await rm.closeRoom({ roomCode: room.roomCode, token: hostToken });
    const fetched = await db.getRoom(room.roomCode);
    expect(fetched).toBeNull();

    // Abandoned room cleanup: room older than 1 hour is deleted
    const { room: oldRoom } = await rm.createRoom({
      mode: 'multiplayer',
      poolType: 'national',
      hostName: 'Old Host',
    });
    oldRoom.expiresAt = Date.now() - 1000; // Expired
    await db.saveRoom(oldRoom);

    const cleaned = await db.cleanupExpiredRooms(Date.now());
    expect(cleaned).toBeGreaterThanOrEqual(1);

    const checkOld = await db.getRoom(oldRoom.roomCode);
    expect(checkOld).toBeNull();
  });

  it('supports match formats (auto-rotate, normal league, and cup knockout)', async () => {
    const { room: r1 } = await rm.createRoom({
      mode: 'multiplayer',
      poolType: 'national',
      hostName: 'Host 1',
      matchFormat: 'auto',
    });
    expect(r1.matchFormat).toBe('auto');

    const { room: r2 } = await rm.createRoom({
      mode: 'multiplayer',
      poolType: 'national',
      hostName: 'Host 2',
      matchFormat: 'normal',
    });
    expect(r2.matchFormat).toBe('normal');

    const { room: r3 } = await rm.createRoom({
      mode: 'multiplayer',
      poolType: 'national',
      hostName: 'Host 3',
      matchFormat: 'knockout',
    });
    expect(r3.matchFormat).toBe('knockout');
  });
});

