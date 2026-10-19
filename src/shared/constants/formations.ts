import { FormationDefinition, Position } from '../types/index.js';

export const FORMATIONS: Record<string, FormationDefinition> = {
  '4-3-3': {
    id: '4-3-3',
    name: '4-3-3 Standard',
    description: 'Balanced Dutch/Spanish system featuring wingers and a midfield triangle.',
    slots: [
      { id: 'gk', name: 'Goalkeeper', group: 'GK', defaultPosition: 'GK', eligiblePositions: ['GK'], coordinates: { x: 50, y: 92 } },
      { id: 'lb', name: 'Left Back', group: 'DEF', defaultPosition: 'LB', eligiblePositions: ['LB', 'LWB'], coordinates: { x: 15, y: 75 } },
      { id: 'cb1', name: 'Left Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 38, y: 78 } },
      { id: 'cb2', name: 'Right Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 62, y: 78 } },
      { id: 'rb', name: 'Right Back', group: 'DEF', defaultPosition: 'RB', eligiblePositions: ['RB', 'RWB'], coordinates: { x: 85, y: 75 } },
      { id: 'cm1', name: 'Left Central Midfielder', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CDM', 'CAM'], coordinates: { x: 30, y: 52 } },
      { id: 'cm2', name: 'Central Holding Midfielder', group: 'MID', defaultPosition: 'CDM', eligiblePositions: ['CDM', 'CM'], coordinates: { x: 50, y: 58 } },
      { id: 'cam', name: 'Right Central Midfielder', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CAM', 'CDM'], coordinates: { x: 70, y: 52 } },
      { id: 'lw', name: 'Left Winger', group: 'FWD', defaultPosition: 'LW', eligiblePositions: ['LW', 'LM'], coordinates: { x: 20, y: 25 } },
      { id: 'st', name: 'Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 50, y: 18 } },
      { id: 'rw', name: 'Right Winger', group: 'FWD', defaultPosition: 'RW', eligiblePositions: ['RW', 'RM'], coordinates: { x: 80, y: 25 } },
    ],
  },
  '4-4-2': {
    id: '4-4-2',
    name: '4-4-2 Classic Flat',
    description: 'Traditional solid formation with twin strikers and width from wide midfielders.',
    slots: [
      { id: 'gk', name: 'Goalkeeper', group: 'GK', defaultPosition: 'GK', eligiblePositions: ['GK'], coordinates: { x: 50, y: 92 } },
      { id: 'lb', name: 'Left Back', group: 'DEF', defaultPosition: 'LB', eligiblePositions: ['LB', 'LWB'], coordinates: { x: 15, y: 75 } },
      { id: 'cb1', name: 'Left Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 38, y: 78 } },
      { id: 'cb2', name: 'Right Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 62, y: 78 } },
      { id: 'rb', name: 'Right Back', group: 'DEF', defaultPosition: 'RB', eligiblePositions: ['RB', 'RWB'], coordinates: { x: 85, y: 75 } },
      { id: 'lm', name: 'Left Midfielder', group: 'MID', defaultPosition: 'LM', eligiblePositions: ['LM', 'LW'], coordinates: { x: 15, y: 48 } },
      { id: 'cm1', name: 'Left Central Midfielder', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CDM'], coordinates: { x: 38, y: 52 } },
      { id: 'cm2', name: 'Right Central Midfielder', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CAM', 'CDM'], coordinates: { x: 62, y: 52 } },
      { id: 'rm', name: 'Right Midfielder', group: 'MID', defaultPosition: 'RM', eligiblePositions: ['RM', 'RW'], coordinates: { x: 85, y: 48 } },
      { id: 'st1', name: 'Left Center Forward', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 38, y: 20 } },
      { id: 'st2', name: 'Right Center Forward', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 62, y: 20 } },
    ],
  },
  '4-2-3-1': {
    id: '4-2-3-1',
    name: '4-2-3-1 Modern Tactical',
    description: 'Double pivot providing defensive shield with an attacking midfield trio behind a lone striker.',
    slots: [
      { id: 'gk', name: 'Goalkeeper', group: 'GK', defaultPosition: 'GK', eligiblePositions: ['GK'], coordinates: { x: 50, y: 92 } },
      { id: 'lb', name: 'Left Back', group: 'DEF', defaultPosition: 'LB', eligiblePositions: ['LB', 'LWB'], coordinates: { x: 15, y: 75 } },
      { id: 'cb1', name: 'Left Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 38, y: 78 } },
      { id: 'cb2', name: 'Right Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 62, y: 78 } },
      { id: 'rb', name: 'Right Back', group: 'DEF', defaultPosition: 'RB', eligiblePositions: ['RB', 'RWB'], coordinates: { x: 85, y: 75 } },
      { id: 'cdm1', name: 'Left Defensive Pivot', group: 'MID', defaultPosition: 'CDM', eligiblePositions: ['CDM', 'CM'], coordinates: { x: 38, y: 62 } },
      { id: 'cdm2', name: 'Right Defensive Pivot', group: 'MID', defaultPosition: 'CDM', eligiblePositions: ['CDM', 'CM'], coordinates: { x: 62, y: 62 } },
      { id: 'lm', name: 'Left Attacking Midfielder', group: 'MID', defaultPosition: 'LM', eligiblePositions: ['LM', 'LW', 'CAM'], coordinates: { x: 20, y: 38 } },
      { id: 'cam', name: 'Central Playmaker', group: 'MID', defaultPosition: 'CAM', eligiblePositions: ['CAM', 'CM', 'SS'], coordinates: { x: 50, y: 38 } },
      { id: 'rm', name: 'Right Attacking Midfielder', group: 'MID', defaultPosition: 'RM', eligiblePositions: ['RM', 'RW', 'CAM'], coordinates: { x: 80, y: 38 } },
      { id: 'st', name: 'Lone Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 50, y: 18 } },
    ],
  },
  '3-5-2': {
    id: '3-5-2',
    name: '3-5-2 Wing-Back System',
    description: 'Three central defenders with aggressive wing-backs controlling the flanks and a packed central midfield.',
    slots: [
      { id: 'gk', name: 'Goalkeeper', group: 'GK', defaultPosition: 'GK', eligiblePositions: ['GK'], coordinates: { x: 50, y: 92 } },
      { id: 'cb1', name: 'Left Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 28, y: 78 } },
      { id: 'cb2', name: 'Central Sweeper / Stopper', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 50, y: 80 } },
      { id: 'cb3', name: 'Right Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 72, y: 78 } },
      { id: 'lwb', name: 'Left Wing-Back', group: 'DEF', defaultPosition: 'LWB', eligiblePositions: ['LWB', 'LB', 'LM'], coordinates: { x: 12, y: 55 } },
      { id: 'cm1', name: 'Left Central Midfielder', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CDM'], coordinates: { x: 35, y: 54 } },
      { id: 'cam', name: 'Attacking Playmaker', group: 'MID', defaultPosition: 'CAM', eligiblePositions: ['CAM', 'CM', 'SS'], coordinates: { x: 50, y: 40 } },
      { id: 'cm2', name: 'Right Central Midfielder', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CDM'], coordinates: { x: 65, y: 54 } },
      { id: 'rwb', name: 'Right Wing-Back', group: 'DEF', defaultPosition: 'RWB', eligiblePositions: ['RWB', 'RB', 'RM'], coordinates: { x: 88, y: 55 } },
      { id: 'st1', name: 'Left Center Forward', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 38, y: 18 } },
      { id: 'st2', name: 'Right Center Forward', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 62, y: 18 } },
    ],
  },
};

export const DEFAULT_FORMATION_ID = '4-3-3';
export const FORMATION_PRESETS = FORMATIONS;

/**
 * Checks whether a player's natural or secondary positions qualify them for a given formation slot.
 */
export function isPlayerEligibleForSlot(
  player: { naturalPositions: Position[]; secondaryPositions: Position[] },
  slot: { eligiblePositions: Position[] }
): boolean {
  const allPositions = [...player.naturalPositions, ...player.secondaryPositions];
  return allPositions.some((pos) => slot.eligiblePositions.includes(pos));
}
