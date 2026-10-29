import {
  DraftTurn,
  FormationDefinition,
  MatchSimulationState,
  PlayerDraftState,
  PlayerVersion,
  PoolType,
  RoomState,
  TeamEdition,
  LiveMentality,
  DefensiveStyle,
  PassingStyle,
  TouchlineShout,
  HistoricalScenario,
} from '../../shared/types/index.js';
import { FORMATIONS, isPlayerEligibleForSlot } from '../../shared/constants/formations.js';
import { DraftEngine } from '../../shared/engine/draftEngine.js';
import { MatchEngine } from '../../shared/engine/matchEngine.js';
import { ChemistryEngine } from '../../shared/engine/chemistryEngine.js';
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

  private cloneRoom(room: RoomState): RoomState {
    const cloned: RoomState = {
      ...room,
      updatedAt: Date.now(),
      hostDraft: {
        ...room.hostDraft,
        draftedSlots: { ...room.hostDraft.draftedSlots },
        usedIdentityIds: [...room.hostDraft.usedIdentityIds],
        currentRoster: [...room.hostDraft.currentRoster],
        currentTeamEdition: room.hostDraft.currentTeamEdition
          ? { ...room.hostDraft.currentTeamEdition }
          : null,
      },
      guestDraft: room.guestDraft
        ? {
            ...room.guestDraft,
            draftedSlots: { ...room.guestDraft.draftedSlots },
            usedIdentityIds: [...room.guestDraft.usedIdentityIds],
            currentRoster: [...room.guestDraft.currentRoster],
            currentTeamEdition: room.guestDraft.currentTeamEdition
              ? { ...room.guestDraft.currentTeamEdition }
              : null,
          }
        : undefined,
    };
    this.currentRoom = cloned;
    return cloned;
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
    enableSubstitutions?: boolean;
  }): { room: RoomState; hostToken: string; guestToken: string } {
    const roomCode = 'SOLO-' + Math.floor(100000 + Math.random() * 900000);
    const hostToken = 'solo-host-' + Math.random().toString(36).substring(2, 10);
    const guestToken = 'solo-guest-ai';
    const now = Date.now();
    const expiresAt = now + 60 * 60 * 1000;
    const enableSubstitutions = params.enableSubstitutions !== false;

    const hostDraft = DraftEngine.createInitialDraftState({
      seatId: 'host',
      playerId: `player-${hostToken.slice(0, 8)}`,
      playerName: params.hostName.trim() || 'Solo Manager',
      poolType: params.poolType,
      formationId: params.formationId,
      customFormation: params.customFormation,
      enableSubstitutions,
    });

    const soloFormations = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '3-4-3', '4-1-2-1-2'];
    const aiFormationId = soloFormations[Math.floor(Math.random() * soloFormations.length)];
    const guestDraft = DraftEngine.createInitialDraftState({
      seatId: 'guest',
      playerId: 'solo-opponent-ai',
      playerName: 'Tactical AI Challenger',
      poolType: params.poolType,
      formationId: aiFormationId,
      enableSubstitutions,
    });

    const room: RoomState = {
      roomCode,
      status: 'drafting',
      mode: 'solo',
      poolType: params.poolType,
      matchFormat: params.matchFormat || 'auto',
      enableSubstitutions,
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
    return this.cloneRoom(room);
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
    return this.cloneRoom(room);
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
      return this.cloneRoom(room);
    }

    // Run AI turn immediately with 0ms delay
    this.advanceTurnToAi(room);
    return this.cloneRoom(room);
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
    const openSlots = DraftEngine.getOpenSlots(aiDraft);
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
    return this.cloneRoom(room);
  }

  startMatch(params: {
    roomCode: string;
    token: string;
    matchDurationSec?: number;
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

    // Ensure authentic matchday substitutes are populated only if substitutions are enabled
    if (room.enableSubstitutions !== false) {
      if (!room.hostDraft.benchSlots || Object.keys(room.hostDraft.benchSlots).length === 0) {
        room.hostDraft.benchSlots = DraftEngine.generateBenchReserves(room.hostDraft, this.getPlayers());
      }
      if (room.guestDraft && (!room.guestDraft.benchSlots || Object.keys(room.guestDraft.benchSlots).length === 0)) {
        room.guestDraft.benchSlots = DraftEngine.generateBenchReserves(room.guestDraft, this.getPlayers());
      }
    } else {
      room.hostDraft.benchSlots = undefined;
      if (room.guestDraft) {
        room.guestDraft.benchSlots = undefined;
      }
    }

    const simulation = MatchEngine.simulateMatch(room.hostDraft, room.guestDraft!, {
      knockoutMode: isKnockout,
      randomSeed: now,
      matchDurationSec: params.matchDurationSec,
    });
    simulation.startTime = now;
    simulation.status = 'live';
    simulation.knockoutMode = isKnockout;
    simulation.matchFormat = isKnockout ? 'cup' : 'league';
    simulation.enableSubstitutions = room.enableSubstitutions !== false;

    this.currentMatch = simulation;
    room.status = 'simulating';
    room.matchId = simulation.matchId;
    room.updatedAt = now;

    const initialSim = MatchEngine.getAuthoritativeStateAtTime(simulation, now);
    return { room, simulation: initialSim };
  }

  createScenarioMatch(scenario: HistoricalScenario): { room: RoomState; simulation: MatchSimulationState } {
    const allPlayers = this.getPlayers();
    const hostPlayers = allPlayers.filter((p) => p.editionId === scenario.userTeam.editionId);
    const guestPlayers = allPlayers.filter((p) => p.editionId === scenario.opponentTeam.editionId);

    const hostFormation = FORMATIONS[scenario.userTeam.formationId] || FORMATIONS['4-3-3'];
    const guestFormation = FORMATIONS[scenario.opponentTeam.formationId] || FORMATIONS['4-3-3'];

    const buildRosterDraft = (
      name: string,
      seatId: 'host' | 'guest',
      formation: FormationDefinition,
      players: PlayerVersion[],
      poolType: PoolType
    ): PlayerDraftState => {
      const draft = DraftEngine.createInitialDraftState({
        seatId,
        playerId: `player-${seatId}`,
        playerName: name,
        formationId: formation.id,
        poolType,
      });

      const usedIds = new Set<string>();
      const benchSlots: Record<string, any> = {};

      for (const slot of formation.slots) {
        const candidate = players.find(
          (p) => !usedIds.has(p.id) && isPlayerEligibleForSlot(p, slot)
        ) || players.find((p) => !usedIds.has(p.id)) || players[0];

        if (candidate) {
          usedIds.add(candidate.id);
          draft.draftedSlots[slot.id] = {
            slotId: slot.id,
            assignedPosition: slot.defaultPosition,
            player: candidate,
          };
          draft.usedIdentityIds.push(candidate.identityId);
        }
      }

      const benchCandidates = players.filter((p) => !usedIds.has(p.id));
      benchCandidates.slice(0, 9).forEach((p, idx) => {
        benchSlots[`bench-${idx + 1}`] = {
          slotId: `bench-${idx + 1}`,
          assignedPosition: p.naturalPositions[0] || 'CM',
          player: p,
        };
      });
      draft.benchSlots = benchSlots;
      draft.chemistry = ChemistryEngine.calculateSquadChemistry(draft).total;

      return draft;
    };

    const hostDraft = buildRosterDraft(
      scenario.userTeam.name,
      'host',
      hostFormation,
      hostPlayers.length >= 11 ? hostPlayers : allPlayers.slice(0, 18),
      scenario.userTeam.poolType
    );
    const guestDraft = buildRosterDraft(
      scenario.opponentTeam.name,
      'guest',
      guestFormation,
      guestPlayers.length >= 11 ? guestPlayers : allPlayers.slice(18, 36),
      scenario.opponentTeam.poolType
    );

    const now = Date.now();
    const duration = scenario.durationSec || 45;
    const roomCode = 'SOLO-SCENARIO-' + Math.floor(100000 + Math.random() * 900000);

    const simulation = MatchEngine.simulateMatch(hostDraft, guestDraft, {
      knockoutMode: true,
      randomSeed: now,
      matchDurationSec: duration,
    });

    simulation.startTime = now - (scenario.startingSecond * 1000);
    simulation.status = 'live';
    simulation.knockoutMode = true;
    simulation.matchFormat = 'cup';

    const pastEvents: any[] = [];
    pastEvents.push({
      id: `ev-0-scenariokickoff`,
      second: 0,
      minute: 0,
      period: 'first_half',
      type: 'kickoff',
      team: 'host',
      description: `Historical Scenario: ${scenario.title} — ${scenario.subtitle}`,
      score: { host: 0, guest: 0 },
      pitchLocation: { x: 50, y: 50 },
    });

    for (let h = 1; h <= scenario.startingScore.host; h++) {
      const sec = Math.min(scenario.startingSecond - 2, Math.floor((scenario.startingSecond / (scenario.startingScore.host + 1)) * h));
      pastEvents.push({
        id: `ev-${sec}-scenariogoal-host-${h}`,
        second: sec,
        minute: Math.floor((scenario.startingMinute / (scenario.startingScore.host + 1)) * h),
        period: 'first_half',
        type: 'goal',
        team: 'host',
        description: `GOAL! ${scenario.userTeam.name} score in the opening half!`,
        score: { host: h, guest: 0 },
        pitchLocation: { x: 95, y: 50 },
        xG: 0.65,
      });
    }

    for (let g = 1; g <= scenario.startingScore.guest; g++) {
      const sec = Math.min(scenario.startingSecond - 1, Math.floor((scenario.startingSecond / (scenario.startingScore.guest + 1)) * g));
      pastEvents.push({
        id: `ev-${sec}-scenariogoal-guest-${g}`,
        second: sec,
        minute: Math.floor((scenario.startingMinute / (scenario.startingScore.guest + 1)) * g),
        period: 'first_half',
        type: 'goal',
        team: 'guest',
        description: `GOAL! ${scenario.opponentTeam.name} strike with clinical precision!`,
        score: { host: scenario.startingScore.host, guest: g },
        pitchLocation: { x: 5, y: 50 },
        xG: 0.70,
      });
    }

    const remainingEvents = simulation.events.filter((e) => e.second > scenario.startingSecond);
    simulation.events = [...pastEvents, ...remainingEvents];

    const room: RoomState = {
      roomCode,
      status: 'simulating',
      mode: 'solo',
      poolType: scenario.userTeam.poolType,
      matchFormat: 'knockout',
      createdAt: now,
      updatedAt: now,
      expiresAt: now + 60 * 60 * 1000,
      hostSeat: { token: 'solo-host-scenario', connected: true, lastPing: now },
      guestSeat: { token: 'solo-guest-ai', connected: true, lastPing: now },
      turnNumber: 12,
      activeTurn: 'host',
      turnDeadline: 0,
      hostDraft,
      guestDraft,
      matchId: simulation.matchId,
    };

    this.currentRoom = room;
    this.currentMatch = simulation;

    const initialSim = MatchEngine.getAuthoritativeStateAtTime(simulation, now);
    return { room, simulation: initialSim };
  }

  makeSubstitution(
    slotId: string,
    subPlayer: PlayerVersion,
    team: 'host' | 'guest' = 'host'
  ): MatchSimulationState | null {
    if (!this.currentMatch) return null;
    this.currentMatch = MatchEngine.makeSubstitution(
      this.currentMatch,
      team,
      slotId,
      subPlayer,
      Date.now(),
      this.currentRoom?.hostDraft,
      this.currentRoom?.guestDraft
    );
    return this.getLiveMatch(this.currentRoom?.roomCode || '');
  }

  createPrebuiltMatch(params: {
    hostDraft: PlayerDraftState;
    guestDraft: PlayerDraftState;
    matchDurationSec?: number;
    isKnockout?: boolean;
    poolType?: PoolType;
  }): { room: RoomState; simulation: MatchSimulationState } {
    const roomCode = 'SOLO-TOURNEY-' + Math.floor(100000 + Math.random() * 900000);
    const hostToken = 'solo-host-' + Math.random().toString(36).substring(2, 10);
    const guestToken = 'solo-guest-ai';
    const now = Date.now();
    const expiresAt = now + 60 * 60 * 1000;
    const isKnockout = params.isKnockout ?? true;

    const room: RoomState = {
      roomCode,
      status: 'simulating',
      mode: 'solo',
      poolType: params.poolType || 'national',
      matchFormat: isKnockout ? 'knockout' : 'normal',
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
      turnNumber: 12,
      activeTurn: 'host',
      turnDeadline: 0,
      hostDraft: params.hostDraft,
      guestDraft: params.guestDraft,
    };

    if (!params.hostDraft.benchSlots || Object.keys(params.hostDraft.benchSlots).length === 0) {
      params.hostDraft.benchSlots = DraftEngine.generateBenchReserves(params.hostDraft, this.getPlayers());
    }
    if (params.guestDraft && (!params.guestDraft.benchSlots || Object.keys(params.guestDraft.benchSlots).length === 0)) {
      params.guestDraft.benchSlots = DraftEngine.generateBenchReserves(params.guestDraft, this.getPlayers());
    }

    const simulation = MatchEngine.simulateMatch(params.hostDraft, params.guestDraft, {
      knockoutMode: isKnockout,
      randomSeed: now,
      matchDurationSec: params.matchDurationSec,
    });
    simulation.startTime = now;
    simulation.status = 'live';
    simulation.knockoutMode = isKnockout;
    simulation.matchFormat = isKnockout ? 'cup' : 'league';

    this.currentRoom = room;
    this.currentMatch = simulation;
    room.matchId = simulation.matchId;

    const initialSim = MatchEngine.getAuthoritativeStateAtTime(simulation, now);
    return { room, simulation: initialSim };
  }

  updateLiveMentality(mentality: any, team: 'host' | 'guest' = 'host'): MatchSimulationState | null {
    if (!this.currentMatch) return null;
    this.currentMatch = MatchEngine.updateLiveMentality(
      this.currentMatch,
      mentality,
      team,
      Date.now(),
      this.currentRoom?.hostDraft,
      this.currentRoom?.guestDraft
    );
    return this.getLiveMatch(this.currentRoom?.roomCode || '');
  }

  updateLiveTactics(
    tactics: {
      mentality?: LiveMentality;
      defensiveStyle?: DefensiveStyle;
      passingStyle?: PassingStyle;
      shout?: TouchlineShout;
    },
    team: 'host' | 'guest' = 'host'
  ): MatchSimulationState | null {
    if (!this.currentMatch) return null;
    this.currentMatch = MatchEngine.updateLiveTactics(
      this.currentMatch,
      tactics,
      team,
      Date.now(),
      this.currentRoom?.hostDraft,
      this.currentRoom?.guestDraft
    );
    return this.getLiveMatch(this.currentRoom?.roomCode || '');
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

  requestRematch(params: { roomCode: string; token: string }): { room: RoomState } {
    if (!this.currentRoom || this.currentRoom.roomCode !== params.roomCode) {
      throw new Error('Solo room not found');
    }
    const now = Date.now();
    this.currentMatch = null;
    this.currentRoom.status = 'drafting';
    this.currentRoom.matchId = undefined;
    this.currentRoom.lastPickAnnouncement = undefined;
    this.currentRoom.rematch = undefined;
    this.currentRoom.turnNumber = 1;
    this.currentRoom.activeTurn = 'host';
    this.currentRoom.turnDeadline = now + 40000;
    this.currentRoom.updatedAt = now;

    // Reset host draft
    this.currentRoom.hostDraft = DraftEngine.createInitialDraftState({
      seatId: 'host',
      playerId: this.currentRoom.hostDraft.playerId,
      playerName: this.currentRoom.hostDraft.playerName,
      poolType: this.currentRoom.poolType,
      formationId: this.currentRoom.hostDraft.formation?.id,
      customFormation: this.currentRoom.hostDraft.formation?.isCustom ? this.currentRoom.hostDraft.formation : undefined,
    });

    // Reset AI opponent draft with fresh random tactical formation
    const soloFormations = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '3-4-3', '4-1-2-1-2'];
    const aiFormationId = soloFormations[Math.floor(Math.random() * soloFormations.length)];
    this.currentRoom.guestDraft = DraftEngine.createInitialDraftState({
      seatId: 'guest',
      playerId: 'solo-opponent-ai',
      playerName: 'Tactical AI Challenger',
      poolType: this.currentRoom.poolType,
      formationId: aiFormationId,
    });

    return { room: this.cloneRoom(this.currentRoom) };
  }
}

export const offlineSoloEngine = OfflineSoloEngine.getInstance();

