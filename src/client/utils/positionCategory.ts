import type { Position } from '../../shared/types/index.js';

export type PositionCategory = 'GOALKEEPER' | 'DEFENDER' | 'MIDFIELDER' | 'ATTACKER';

export interface CategoryConfig {
  id: PositionCategory;
  label: string;
  icon: string;
  order: number;
}

const DEF_POSITIONS = new Set(['CB', 'LB', 'RB', 'LWB', 'RWB', 'SW']);
const MID_POSITIONS = new Set(['CDM', 'CM', 'CAM', 'LM', 'RM']);
const ATT_POSITIONS = new Set(['ST', 'CF', 'LW', 'RW']);

/**
 * Maps any position string to its macro category: GOALKEEPER, DEFENDER, MIDFIELDER, or ATTACKER
 */
export function getPositionCategory(pos: string): PositionCategory {
  if (pos === 'GK') return 'GOALKEEPER';
  if (DEF_POSITIONS.has(pos)) return 'DEFENDER';
  if (MID_POSITIONS.has(pos)) return 'MIDFIELDER';
  if (ATT_POSITIONS.has(pos)) return 'ATTACKER';
  return 'MIDFIELDER';
}

/**
 * Returns macro category of a player based on their primary natural position
 */
export function getPlayerCategory(player: { naturalPositions: string[] }): PositionCategory {
  const primaryPos = player.naturalPositions[0] || 'CM';
  return getPositionCategory(primaryPos);
}

/**
 * Distinct styling for position badges on cards and tokens:
 * - GK: Amber/Golden
 * - DEF: Sky/Cyan Blue
 * - MID: Emerald Green
 * - ATT: Crimson/Rose Red
 */
export function getPositionBadgeClass(pos: string): string {
  const category = getPositionCategory(pos);
  switch (category) {
    case 'GOALKEEPER':
      return 'bg-amber-500/15 text-amber-300 border border-amber-500/35 shadow-xs';
    case 'DEFENDER':
      return 'bg-blue-500/15 text-blue-300 border border-blue-500/35 shadow-xs';
    case 'MIDFIELDER':
      return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 shadow-xs';
    case 'ATTACKER':
      return 'bg-rose-500/15 text-rose-300 border border-rose-500/35 shadow-xs';
  }
}

export const CATEGORY_ORDER: CategoryConfig[] = [
  { id: 'GOALKEEPER', label: 'Goalkeepers', icon: '🧤', order: 1 },
  { id: 'DEFENDER', label: 'Defenders', icon: '🛡️', order: 2 },
  { id: 'MIDFIELDER', label: 'Midfielders', icon: '⚙️', order: 3 },
  { id: 'ATTACKER', label: 'Attackers', icon: '⚡', order: 4 },
];

