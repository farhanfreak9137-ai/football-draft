import {
  FormationDefinition,
  FormationSlot,
  PlayerDraftState,
  PlayerVersion,
  PoolType,
  Position,
  TeamEdition,
} from '../types/index.js';
import { FORMATIONS, isPlayerEligibleForSlot } from '../constants/formations.js';
import { PRNG } from './prng.js';

export interface DraftDatabase {
  editions: TeamEdition[];
  players: PlayerVersion[];
}

export class DraftEngine {
  /**
   * Initializes a new draft state for a player seat.
   */
  static createInitialDraftState(params: {
    seatId: 'host' | 'guest';
    playerId: string;
    playerName: string;
    poolType: PoolType;
    formationId?: string;
    customFormation?: FormationDefinition;
  }): PlayerDraftState {
    const formation = params.customFormation || FORMATIONS[params.formationId || '4-3-3'] || FORMATIONS['4-3-3'];
    return {
      seatId: params.seatId,
      playerId: params.playerId,
      playerName: params.playerName,
      poolType: params.poolType,
      formation,
      strategy: 'balanced',
      draftedSlots: {},
      usedIdentityIds: [],
      rerollsRemaining: 2,
      currentTeamEdition: null,
      currentRoster: [],
      isReady: false,
    };
  }

  /**
   * Determines if a player version is eligible to be drafted into any remaining open slot
   * given current drafted state (uniqueness check + open position slots check).
   */
  static isPlayerDraftable(
    player: PlayerVersion,
    draftState: PlayerDraftState,
    excludedIdentityIds: string[] = []
  ): { eligible: boolean; openSlotIds: string[] } {
    // 1. Identity uniqueness check: real player identity can only appear once in match (22 unique players rule)
    if (draftState.usedIdentityIds.includes(player.identityId) || excludedIdentityIds.includes(player.identityId)) {
      return { eligible: false, openSlotIds: [] };
    }

    // 2. Check if there is an open slot that accepts any of the player's natural or secondary positions
    const openSlots = this.getOpenSlots(draftState);

    const matchingSlotIds = openSlots
      .filter((slot) => isPlayerEligibleForSlot(player, slot))
      .map((slot) => slot.id);

    return {
      eligible: matchingSlotIds.length > 0,
      openSlotIds: matchingSlotIds,
    };
  }

  /**
   * Returns all currently open (undrafted) slots for a given draft state.
   */
  static getOpenSlots(draftState: PlayerDraftState): FormationSlot[] {
    return draftState.formation.slots.filter(
      (slot) => !draftState.draftedSlots[slot.id]
    );
  }

  /**
   * Checks whether a team edition has at least one draftable player for current state.
   */
  static hasAnyLegalPick(
    editionId: string,
    allPlayers: PlayerVersion[],
    draftState: PlayerDraftState,
    excludedIdentityIds: string[] = []
  ): boolean {
    const editionRoster = allPlayers.filter((p) => p.editionId === editionId);
    return editionRoster.some(
      (player) => this.isPlayerDraftable(player, draftState, excludedIdentityIds).eligible
    );
  }

  /**
   * Rolls a team edition with equal probability.
   * If rolled edition has no legal picks, automatically replaces it without consuming a reroll.
   * Also ensures different teams are rolled (e.g. AI/opponent cannot roll the same team as host).
   */
  static rollTeamEdition(
    draftState: PlayerDraftState,
    db: DraftDatabase,
    prng: PRNG,
    options: { excludedEditionIds?: string[]; excludedIdentityIds?: string[] } = {}
  ): { edition: TeamEdition; roster: PlayerVersion[] } {
    let eligibleEditions = db.editions.filter(
      (ed) => ed.editionType === draftState.poolType
    );

    if (eligibleEditions.length === 0) {
      throw new Error(`No editions available for pool type ${draftState.poolType}`);
    }

    // Exclude specified edition IDs (e.g. opponent's currently rolled team edition or same team)
    if (options.excludedEditionIds && options.excludedEditionIds.length > 0) {
      const filtered = eligibleEditions.filter(
        (ed) => !options.excludedEditionIds!.includes(ed.id)
      );
      if (filtered.length > 0) {
        eligibleEditions = filtered;
      }
    }

    // Filter editions that have at least one legal player for current open slots and excluded match identities
    const validEditions = eligibleEditions.filter((ed) =>
      this.hasAnyLegalPick(ed.id, db.players, draftState, options.excludedIdentityIds)
    );

    if (validEditions.length === 0) {
      throw new Error('NO_LEGAL_PICKS_REMAINING_IN_POOL');
    }

    // Equal probability selection among valid editions
    const chosenEdition = prng.pickOne(validEditions);
    const roster = db.players.filter((p) => p.editionId === chosenEdition.id);

    return {
      edition: chosenEdition,
      roster,
    };
  }

  /**
   * Executes a reroll for the player.
   * Consumes 1 reroll and rolls a new edition.
   */
  static executeReroll(
    draftState: PlayerDraftState,
    db: DraftDatabase,
    prng: PRNG,
    options: { excludedEditionIds?: string[]; excludedIdentityIds?: string[] } = {}
  ): PlayerDraftState {
    if (draftState.rerollsRemaining <= 0) {
      throw new Error('No rerolls remaining');
    }

    const excludedEditions = [
      ...(options.excludedEditionIds || []),
      ...(draftState.currentTeamEdition ? [draftState.currentTeamEdition.id] : []),
    ];

    const { edition, roster } = this.rollTeamEdition(draftState, db, prng, {
      ...options,
      excludedEditionIds: excludedEditions,
    });

    return {
      ...draftState,
      rerollsRemaining: draftState.rerollsRemaining - 1,
      currentTeamEdition: edition,
      currentRoster: roster,
    };
  }

  /**
   * Picks a player for a specific slot.
   * Validates slot availability, position eligibility, and identity uniqueness across both teams.
   */
  static pickPlayer(
    draftState: PlayerDraftState,
    playerId: string,
    slotId: string,
    allPlayers: PlayerVersion[],
    excludedIdentityIds: string[] = []
  ): PlayerDraftState {
    const slot = draftState.formation.slots.find((s) => s.id === slotId);
    if (!slot) {
      throw new Error(`Slot ${slotId} does not exist in formation`);
    }

    if (draftState.draftedSlots[slotId]) {
      throw new Error(`Slot ${slotId} is already filled`);
    }

    const player = allPlayers.find((p) => p.id === playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }

    // Uniqueness check (own squad & match-wide 22 unique players rule)
    if (draftState.usedIdentityIds.includes(player.identityId)) {
      throw new Error(`Player identity ${player.name} is already drafted in this XI`);
    }
    if (excludedIdentityIds.includes(player.identityId)) {
      throw new Error(`Player identity ${player.name} has already been drafted by the opponent`);
    }

    // Position eligibility check
    if (!isPlayerEligibleForSlot(player, slot)) {
      throw new Error(
        `Player ${player.name} (${player.naturalPositions.join('/')}) is not eligible for slot ${slot.name}`
      );
    }

    // Determine assigned position
    const assignedPosition: Position = player.naturalPositions.includes(slot.defaultPosition)
      ? slot.defaultPosition
      : player.naturalPositions[0] || player.secondaryPositions[0] || slot.defaultPosition;

    const newDraftedSlots = {
      ...draftState.draftedSlots,
      [slotId]: {
        slotId,
        player,
        assignedPosition,
      },
    };

    const newUsedIdentities = [...draftState.usedIdentityIds, player.identityId];
    const isReady = Object.keys(newDraftedSlots).length === draftState.formation.slots.length;

    return {
      ...draftState,
      draftedSlots: newDraftedSlots,
      usedIdentityIds: newUsedIdentities,
      isReady,
      currentTeamEdition: null,
      currentRoster: [],
    };
  }

  /**
   * Deterministic auto-pick when timer expires:
   * Selects the highest-OVR legal player for a valid open slot.
   * Documented deterministic tie-break:
   * 1. Higher OVR wins.
   * 2. Natural position matches slot default position.
   * 3. Has Golden Legend Seal.
   * 4. Lowest squad number.
   * 5. Stable alphabetical comparison by player ID (`a.id.localeCompare(b.id)`).
   */
  static getDeterministicAutoPick(
    draftState: PlayerDraftState,
    roster: PlayerVersion[],
    excludedIdentityIds: string[] = []
  ): { player: PlayerVersion; slotId: string } {
    const openSlots = draftState.formation.slots.filter(
      (slot) => !draftState.draftedSlots[slot.id]
    );

    if (openSlots.length === 0) {
      throw new Error('Formation is already full');
    }

    // Find all legal (player, slot) pairs
    const legalCandidates: Array<{
      player: PlayerVersion;
      slot: (typeof openSlots)[0];
    }> = [];

    for (const player of roster) {
      if (
        draftState.usedIdentityIds.includes(player.identityId) ||
        excludedIdentityIds.includes(player.identityId)
      ) {
        continue;
      }
      for (const slot of openSlots) {
        if (isPlayerEligibleForSlot(player, slot)) {
          legalCandidates.push({ player, slot });
        }
      }
    }

    if (legalCandidates.length === 0) {
      throw new Error('No legal picks available for auto-pick');
    }

    // Sort by deterministic tie-break criteria
    legalCandidates.sort((a, b) => {
      // 1. OVR descending
      if (b.player.ovr !== a.player.ovr) {
        return b.player.ovr - a.player.ovr;
      }

      // 2. Natural position matches slot default position
      const aNaturalMatch = a.player.naturalPositions.includes(a.slot.defaultPosition) ? 1 : 0;
      const bNaturalMatch = b.player.naturalPositions.includes(b.slot.defaultPosition) ? 1 : 0;
      if (bNaturalMatch !== aNaturalMatch) {
        return bNaturalMatch - aNaturalMatch;
      }

      // 3. Golden Legend Seal
      const aSeal = a.player.hasLegendSeal ? 1 : 0;
      const bSeal = b.player.hasLegendSeal ? 1 : 0;
      if (bSeal !== aSeal) {
        return bSeal - aSeal;
      }

      // 4. Lowest squad number
      if (a.player.squadNumber !== b.player.squadNumber) {
        return a.player.squadNumber - b.player.squadNumber;
      }

      // 5. Stable ID alphabetical fallback
      return a.player.id.localeCompare(b.player.id);
    });

    const best = legalCandidates[0];
    return {
      player: best.player,
      slotId: best.slot.id,
    };
  }
}

