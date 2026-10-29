import {
  PlayerDraftState,
  PlayerVersion,
  Position,
} from '../types/index.js';

export interface PlayerChemistryBreakdown {
  playerId: string;
  positionScore: number; // 0 to 10
  nationLinks: number;
  clubLinks: number;
  totalChemistry: number; // 0 to 10
  stars: 1 | 2 | 3;
}

export interface SquadChemistryReport {
  total: number; // 0 to 100 (alias for overallChemistry)
  overallChemistry: number; // 0 to 100
  positionFidelity: number; // 0 to 100
  synergyBonus: number; // 0 to 100
  individualStars?: number;
  playerBreakdown: Record<string, PlayerChemistryBreakdown>;
  chemistryAdvantage: number; // -0.05 to +0.05 modifier for match engine
}

export class ChemistryEngine {
  /**
   * Evaluates position suitability for a player in a specific slot.
   */
  static evaluatePositionFidelity(
    playerOrPositions: PlayerVersion | Position[],
    defaultPos: Position,
    _group?: string
  ): number {
    const naturalPositions = Array.isArray(playerOrPositions)
      ? playerOrPositions
      : playerOrPositions.naturalPositions || [];
    const secondaryPositions = !Array.isArray(playerOrPositions)
      ? playerOrPositions.secondaryPositions
      : undefined;

    if (naturalPositions.includes(defaultPos)) {
      return 10;
    }
    if (secondaryPositions && secondaryPositions.includes(defaultPos)) {
      return 7.5;
    }

    // Position group fallback
    const isDef = (pos: Position) => ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(pos);
    const isMid = (pos: Position) => ['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(pos);
    const isFwd = (pos: Position) => ['ST', 'CF', 'SS', 'LW', 'RW'].includes(pos);

    if (naturalPositions.includes('GK') && defaultPos !== 'GK') return 1;
    if (defaultPos === 'GK' && !naturalPositions.includes('GK')) return 1;

    const playerPos = naturalPositions[0];
    if (playerPos) {
      if (isDef(playerPos) && isDef(defaultPos)) return 7.0;
      if (isMid(playerPos) && isMid(defaultPos)) return 7.0;
      if (isFwd(playerPos) && isFwd(defaultPos)) return 7.0;
    }

    return 2.5;
  }

  /**
   * Translates difference between squad chemistries into tactical rating advantage (-0.06 to +0.06).
   */
  static getTacticalAdvantageModifier(chemHost: number, chemGuest: number): number {
    const diff = (chemHost - chemGuest) / 100;
    return Math.max(-0.06, Math.min(0.06, Math.round(diff * 0.05 * 1000) / 1000));
  }

  /**
   * Computes the squad chemistry report (0 to 100 scale).
   */
  static calculateSquadChemistry(draft: PlayerDraftState): SquadChemistryReport {
    const slots = Object.values(draft.draftedSlots || {});
    if (slots.length === 0) {
      return {
        total: 50,
        overallChemistry: 50,
        positionFidelity: 50,
        synergyBonus: 0,
        individualStars: 0,
        playerBreakdown: {},
        chemistryAdvantage: 0,
      };
    }

    const playerBreakdown: Record<string, PlayerChemistryBreakdown> = {};
    let totalPositionScore = 0;

    // 1. Position Fidelity
    for (const slot of slots) {
      const p = slot.player;
      const assignedPos = slot.assignedPosition || p.naturalPositions[0];
      const posScore = ChemistryEngine.evaluatePositionFidelity(p, assignedPos);
      totalPositionScore += posScore;

      playerBreakdown[p.id] = {
        playerId: p.id,
        positionScore: posScore,
        nationLinks: 0,
        clubLinks: 0,
        totalChemistry: posScore,
        stars: posScore >= 8 ? 3 : posScore >= 5 ? 2 : 1,
      };
    }

    // 2. Nationality & Club/Edition Synergies
    const allPlayers = slots.map((s) => s.player);
    let totalSynergyPoints = 0;
    let starCount = 0;

    for (const p of allPlayers) {
      let nationCount = 0;
      let editionCount = 0;

      for (const other of allPlayers) {
        if (other.id === p.id) continue;
        // Same team edition (club or national tournament era)
        if (other.editionId === p.editionId) {
          editionCount++;
        }
      }

      if (p.ovr >= 85) starCount++;

      const bd = playerBreakdown[p.id];
      if (bd) {
        bd.clubLinks = editionCount;
        bd.nationLinks = nationCount;
        const synergyContribution = Math.min(4, editionCount * 1.5 + nationCount * 1.0);
        bd.totalChemistry = Math.min(10, bd.positionScore * 0.7 + synergyContribution);
        bd.stars = bd.totalChemistry >= 8 ? 3 : bd.totalChemistry >= 5 ? 2 : 1;
        totalSynergyPoints += synergyContribution;
      }
    }

    const avgPosFidelity = Math.round((totalPositionScore / (slots.length * 10)) * 100);
    const avgSynergy = Math.min(100, Math.round((totalSynergyPoints / (slots.length * 3)) * 100));

    // Overall: 65% position fidelity + 35% synergy
    const overallChemistry = Math.min(100, Math.max(20, Math.round(avgPosFidelity * 0.65 + avgSynergy * 0.35)));

    // Chemistry advantage: -0.04 (terrible chemistry) to +0.04 (100% chemistry)
    const chemistryAdvantage = Math.round(((overallChemistry - 50) / 50) * 0.04 * 1000) / 1000;

    return {
      total: overallChemistry,
      overallChemistry,
      positionFidelity: avgPosFidelity,
      synergyBonus: avgSynergy,
      individualStars: starCount,
      playerBreakdown,
      chemistryAdvantage,
    };
  }
}
