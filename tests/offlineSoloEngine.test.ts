import { describe, it, expect } from 'vitest';
import { offlineSoloEngine } from '../src/client/services/offlineSoloEngine.js';
import { isPlayerEligibleForSlot } from '../src/shared/constants/formations.js';

describe('OfflineSoloEngine (100% Client-Side Offline Mode)', () => {
  it('creates an offline solo room with instant AI opponent', () => {
    const { room, hostToken, guestToken } = offlineSoloEngine.createSoloRoom({
      poolType: 'national',
      hostName: 'Offline Master',
      formationId: '4-3-3',
      matchFormat: 'auto',
    });

    expect(room.mode).toBe('solo');
    expect(room.roomCode.startsWith('SOLO-')).toBe(true);
    expect(room.status).toBe('drafting');
    expect(room.activeTurn).toBe('host');
    expect(room.hostDraft.playerName).toBe('Offline Master');
    expect(room.guestDraft?.playerName).toBe('Tactical AI Challenger');
    expect(hostToken).toBeDefined();
    expect(guestToken).toBeDefined();
    expect(offlineSoloEngine.isSoloRoom(room.roomCode)).toBe(true);
  });

  it('rolls and rerolls team edition for host', () => {
    const { room, hostToken } = offlineSoloEngine.createSoloRoom({
      poolType: 'club',
      hostName: 'Solo Tester',
      formationId: '4-4-2',
    });

    const rolled = offlineSoloEngine.executeRoll({
      roomCode: room.roomCode,
      token: hostToken,
    });

    expect(rolled.hostDraft.currentTeamEdition).toBeDefined();
    expect(rolled.hostDraft.currentRoster.length).toBeGreaterThan(0);
    const initialEditionId = rolled.hostDraft.currentTeamEdition?.id;
    const initialRerolls = rolled.hostDraft.rerollsRemaining;

    // Reroll
    const rerolled = offlineSoloEngine.executeReroll({
      roomCode: room.roomCode,
      token: hostToken,
    });

    expect(rerolled.hostDraft.rerollsRemaining).toBe(initialRerolls - 1);
    expect(rerolled.hostDraft.currentTeamEdition?.id).not.toBe(initialEditionId);
  });

  it('completes a pick and triggers immediate AI pick response', () => {
    const { room, hostToken } = offlineSoloEngine.createSoloRoom({
      poolType: 'national',
      hostName: 'Solo Manager',
      formationId: '4-3-3',
    });

    // Roll host team
    offlineSoloEngine.executeRoll({ roomCode: room.roomCode, token: hostToken });

    // Pick first eligible player for an open slot
    const hostDraft = room.hostDraft;
    const roster = hostDraft.currentRoster;
    let chosenPlayer = roster[0];
    let chosenSlot = hostDraft.formation.slots[0];
    for (const p of roster) {
      const match = hostDraft.formation.slots.find((s) => isPlayerEligibleForSlot(p, s));
      if (match) {
        chosenPlayer = p;
        chosenSlot = match;
        break;
      }
    }

    const afterPick = offlineSoloEngine.executePick({
      roomCode: room.roomCode,
      token: hostToken,
      playerId: chosenPlayer.id,
      slotId: chosenSlot.id,
    });

    // Host has 1 pick
    expect(Object.keys(afterPick.hostDraft.draftedSlots).length).toBe(1);
    // AI has immediately responded with its own pick
    expect(Object.keys(afterPick.guestDraft!.draftedSlots).length).toBe(1);
    // Active turn is back to host for round 2
    expect(afterPick.activeTurn).toBe('host');
    expect(afterPick.turnNumber).toBe(3); // host(1) -> guest(2) -> host(3)
  });

  it('runs match simulation and advances authoritative state', () => {
    const { room, hostToken } = offlineSoloEngine.createSoloRoom({
      poolType: 'national',
      hostName: 'Finalist',
      formationId: '4-3-3',
    });

    // Fill all 11 slots for both
    for (let i = 0; i < 11; i++) {
      const slot = room.hostDraft.formation.slots[i];
      const aiSlot = room.guestDraft!.formation.slots[i];
      const p1 = offlineSoloEngine.getPlayers()[i];
      const p2 = offlineSoloEngine.getPlayers()[i + 20];
      room.hostDraft.draftedSlots[slot.id] = { slotId: slot.id, assignedPosition: slot.defaultPosition, player: p1 };
      room.guestDraft!.draftedSlots[aiSlot.id] = { slotId: aiSlot.id, assignedPosition: aiSlot.defaultPosition, player: p2 };
    }
    room.hostDraft.isReady = true;
    room.guestDraft!.isReady = true;
    room.status = 'draft_complete';

    const { simulation } = offlineSoloEngine.startMatch({
      roomCode: room.roomCode,
      token: hostToken,
    });

    expect(simulation).toBeDefined();
    expect(simulation.status).toBe('live');
    expect(simulation.events.length).toBeGreaterThan(0);

    const live = offlineSoloEngine.getLiveMatch(room.roomCode);
    expect(live).toBeDefined();
    expect(live?.status).toBe('live');
  });
});

