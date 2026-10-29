import { FormationDefinition, FormationSlot, Position, PositionGroup } from '../types/index.js';

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
  '3-4-3': {
    id: '3-4-3',
    name: '3-4-3 Total Attack',
    description: 'Cruyff and modern fluid attacking trident with high-possession wide midfield.',
    slots: [
      { id: 'gk', name: 'Goalkeeper', group: 'GK', defaultPosition: 'GK', eligiblePositions: ['GK'], coordinates: { x: 50, y: 92 } },
      { id: 'cb1', name: 'Left Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 26, y: 78 } },
      { id: 'cb2', name: 'Central Sweeper', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 50, y: 80 } },
      { id: 'cb3', name: 'Right Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 74, y: 78 } },
      { id: 'lm', name: 'Left Midfielder', group: 'MID', defaultPosition: 'LM', eligiblePositions: ['LM', 'LW', 'LWB'], coordinates: { x: 15, y: 50 } },
      { id: 'cm1', name: 'Left Central Midfielder', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CDM'], coordinates: { x: 38, y: 52 } },
      { id: 'cm2', name: 'Right Central Midfielder', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CAM', 'CDM'], coordinates: { x: 62, y: 52 } },
      { id: 'rm', name: 'Right Midfielder', group: 'MID', defaultPosition: 'RM', eligiblePositions: ['RM', 'RW', 'RWB'], coordinates: { x: 85, y: 50 } },
      { id: 'lw', name: 'Left Winger', group: 'FWD', defaultPosition: 'LW', eligiblePositions: ['LW', 'LM', 'ST'], coordinates: { x: 20, y: 22 } },
      { id: 'st', name: 'Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 50, y: 18 } },
      { id: 'rw', name: 'Right Winger', group: 'FWD', defaultPosition: 'RW', eligiblePositions: ['RW', 'RM', 'ST'], coordinates: { x: 80, y: 22 } },
    ],
  },
  '5-3-2': {
    id: '5-3-2',
    name: '5-3-2 Solid Counter',
    description: 'Impenetrable defensive wall with surging wing-backs and clinical strike partnership.',
    slots: [
      { id: 'gk', name: 'Goalkeeper', group: 'GK', defaultPosition: 'GK', eligiblePositions: ['GK'], coordinates: { x: 50, y: 92 } },
      { id: 'lwb', name: 'Left Wing-Back', group: 'DEF', defaultPosition: 'LWB', eligiblePositions: ['LWB', 'LB', 'LM'], coordinates: { x: 12, y: 68 } },
      { id: 'cb1', name: 'Left Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 30, y: 78 } },
      { id: 'cb2', name: 'Central Sweeper', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 50, y: 82 } },
      { id: 'cb3', name: 'Right Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 70, y: 78 } },
      { id: 'rwb', name: 'Right Wing-Back', group: 'DEF', defaultPosition: 'RWB', eligiblePositions: ['RWB', 'RB', 'RM'], coordinates: { x: 88, y: 68 } },
      { id: 'cm1', name: 'Left Central Midfielder', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CDM'], coordinates: { x: 32, y: 50 } },
      { id: 'cdm', name: 'Holding Midfielder', group: 'MID', defaultPosition: 'CDM', eligiblePositions: ['CDM', 'CM'], coordinates: { x: 50, y: 56 } },
      { id: 'cm2', name: 'Right Central Midfielder', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CAM', 'CDM'], coordinates: { x: 68, y: 50 } },
      { id: 'st1', name: 'Left Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 38, y: 20 } },
      { id: 'st2', name: 'Right Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 62, y: 20 } },
    ],
  },
  '4-1-2-1-2': {
    id: '4-1-2-1-2',
    name: '4-1-2-1-2 Narrow Diamond',
    description: 'Ancelotti Milan style with deep pivot, box-to-box shuttlers, and pure number 10.',
    slots: [
      { id: 'gk', name: 'Goalkeeper', group: 'GK', defaultPosition: 'GK', eligiblePositions: ['GK'], coordinates: { x: 50, y: 92 } },
      { id: 'lb', name: 'Left Back', group: 'DEF', defaultPosition: 'LB', eligiblePositions: ['LB', 'LWB'], coordinates: { x: 15, y: 75 } },
      { id: 'cb1', name: 'Left Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 38, y: 78 } },
      { id: 'cb2', name: 'Right Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 62, y: 78 } },
      { id: 'rb', name: 'Right Back', group: 'DEF', defaultPosition: 'RB', eligiblePositions: ['RB', 'RWB'], coordinates: { x: 85, y: 75 } },
      { id: 'cdm', name: 'Deep Playmaker (Regista)', group: 'MID', defaultPosition: 'CDM', eligiblePositions: ['CDM', 'CM'], coordinates: { x: 50, y: 64 } },
      { id: 'cm1', name: 'Left Mezzala (Box-to-Box)', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CDM', 'LM'], coordinates: { x: 30, y: 50 } },
      { id: 'cm2', name: 'Right Mezzala', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CAM', 'RM'], coordinates: { x: 70, y: 50 } },
      { id: 'cam', name: 'Trequartista (Number 10)', group: 'MID', defaultPosition: 'CAM', eligiblePositions: ['CAM', 'CM', 'SS'], coordinates: { x: 50, y: 34 } },
      { id: 'st1', name: 'Left Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 38, y: 18 } },
      { id: 'st2', name: 'Right Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 62, y: 18 } },
    ],
  },
  '4-3-1-2': {
    id: '4-3-1-2',
    name: '4-3-1-2 Central Control',
    description: 'Flat midfield trio providing defensive steel behind a legendary trequartista.',
    slots: [
      { id: 'gk', name: 'Goalkeeper', group: 'GK', defaultPosition: 'GK', eligiblePositions: ['GK'], coordinates: { x: 50, y: 92 } },
      { id: 'lb', name: 'Left Back', group: 'DEF', defaultPosition: 'LB', eligiblePositions: ['LB', 'LWB'], coordinates: { x: 15, y: 75 } },
      { id: 'cb1', name: 'Left Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 38, y: 78 } },
      { id: 'cb2', name: 'Right Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 62, y: 78 } },
      { id: 'rb', name: 'Right Back', group: 'DEF', defaultPosition: 'RB', eligiblePositions: ['RB', 'RWB'], coordinates: { x: 85, y: 75 } },
      { id: 'cm1', name: 'Left Central Midfielder', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CDM'], coordinates: { x: 28, y: 55 } },
      { id: 'cm2', name: 'Central Holding Midfielder', group: 'MID', defaultPosition: 'CDM', eligiblePositions: ['CDM', 'CM'], coordinates: { x: 50, y: 58 } },
      { id: 'cm3', name: 'Right Central Midfielder', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CAM'], coordinates: { x: 72, y: 55 } },
      { id: 'cam', name: 'Attacking Playmaker', group: 'MID', defaultPosition: 'CAM', eligiblePositions: ['CAM', 'CM', 'SS'], coordinates: { x: 50, y: 35 } },
      { id: 'st1', name: 'Left Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 38, y: 18 } },
      { id: 'st2', name: 'Right Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 62, y: 18 } },
    ],
  },
  '4-2-2-2': {
    id: '4-2-2-2',
    name: '4-2-2-2 Magic Box',
    description: 'Iconic Brazilian setup with dual pivots and dual attacking playmakers.',
    slots: [
      { id: 'gk', name: 'Goalkeeper', group: 'GK', defaultPosition: 'GK', eligiblePositions: ['GK'], coordinates: { x: 50, y: 92 } },
      { id: 'lb', name: 'Left Back', group: 'DEF', defaultPosition: 'LB', eligiblePositions: ['LB', 'LWB'], coordinates: { x: 15, y: 75 } },
      { id: 'cb1', name: 'Left Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 38, y: 78 } },
      { id: 'cb2', name: 'Right Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 62, y: 78 } },
      { id: 'rb', name: 'Right Back', group: 'DEF', defaultPosition: 'RB', eligiblePositions: ['RB', 'RWB'], coordinates: { x: 85, y: 75 } },
      { id: 'cdm1', name: 'Left Defensive Pivot', group: 'MID', defaultPosition: 'CDM', eligiblePositions: ['CDM', 'CM'], coordinates: { x: 38, y: 62 } },
      { id: 'cdm2', name: 'Right Defensive Pivot', group: 'MID', defaultPosition: 'CDM', eligiblePositions: ['CDM', 'CM'], coordinates: { x: 62, y: 62 } },
      { id: 'cam1', name: 'Left Attacking Playmaker', group: 'MID', defaultPosition: 'CAM', eligiblePositions: ['CAM', 'LM', 'LW'], coordinates: { x: 28, y: 38 } },
      { id: 'cam2', name: 'Right Attacking Playmaker', group: 'MID', defaultPosition: 'CAM', eligiblePositions: ['CAM', 'RM', 'RW'], coordinates: { x: 72, y: 38 } },
      { id: 'st1', name: 'Left Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 38, y: 18 } },
      { id: 'st2', name: 'Right Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 62, y: 18 } },
    ],
  },
  '4-3-2-1': {
    id: '4-3-2-1',
    name: '4-3-2-1 Christmas Tree',
    description: 'Ancelotti famous Christmas Tree with three central midfielders and twin playmakers.',
    slots: [
      { id: 'gk', name: 'Goalkeeper', group: 'GK', defaultPosition: 'GK', eligiblePositions: ['GK'], coordinates: { x: 50, y: 92 } },
      { id: 'lb', name: 'Left Back', group: 'DEF', defaultPosition: 'LB', eligiblePositions: ['LB', 'LWB'], coordinates: { x: 15, y: 75 } },
      { id: 'cb1', name: 'Left Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 38, y: 78 } },
      { id: 'cb2', name: 'Right Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 62, y: 78 } },
      { id: 'rb', name: 'Right Back', group: 'DEF', defaultPosition: 'RB', eligiblePositions: ['RB', 'RWB'], coordinates: { x: 85, y: 75 } },
      { id: 'cm1', name: 'Left Central Midfielder', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CDM'], coordinates: { x: 28, y: 58 } },
      { id: 'cdm', name: 'Central Anchor', group: 'MID', defaultPosition: 'CDM', eligiblePositions: ['CDM', 'CM'], coordinates: { x: 50, y: 62 } },
      { id: 'cm2', name: 'Right Central Midfielder', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CAM'], coordinates: { x: 72, y: 58 } },
      { id: 'cam1', name: 'Left Inverted Playmaker', group: 'MID', defaultPosition: 'CAM', eligiblePositions: ['CAM', 'SS', 'LW'], coordinates: { x: 35, y: 35 } },
      { id: 'cam2', name: 'Right Inverted Playmaker', group: 'MID', defaultPosition: 'CAM', eligiblePositions: ['CAM', 'SS', 'RW'], coordinates: { x: 65, y: 35 } },
      { id: 'st', name: 'Lone Apex Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF'], coordinates: { x: 50, y: 18 } },
    ],
  },
  '4-5-1': {
    id: '4-5-1',
    name: '4-5-1 Midfield Fortress',
    description: 'Dominant five-man midfield creating suffocating numerical superiority.',
    slots: [
      { id: 'gk', name: 'Goalkeeper', group: 'GK', defaultPosition: 'GK', eligiblePositions: ['GK'], coordinates: { x: 50, y: 92 } },
      { id: 'lb', name: 'Left Back', group: 'DEF', defaultPosition: 'LB', eligiblePositions: ['LB', 'LWB'], coordinates: { x: 15, y: 75 } },
      { id: 'cb1', name: 'Left Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 38, y: 78 } },
      { id: 'cb2', name: 'Right Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 62, y: 78 } },
      { id: 'rb', name: 'Right Back', group: 'DEF', defaultPosition: 'RB', eligiblePositions: ['RB', 'RWB'], coordinates: { x: 85, y: 75 } },
      { id: 'lm', name: 'Left Midfielder', group: 'MID', defaultPosition: 'LM', eligiblePositions: ['LM', 'LW'], coordinates: { x: 15, y: 46 } },
      { id: 'cm1', name: 'Left Central Midfielder', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CDM'], coordinates: { x: 34, y: 52 } },
      { id: 'cdm', name: 'Central Defensive Anchor', group: 'MID', defaultPosition: 'CDM', eligiblePositions: ['CDM', 'CM'], coordinates: { x: 50, y: 58 } },
      { id: 'cm2', name: 'Right Central Midfielder', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CAM'], coordinates: { x: 66, y: 52 } },
      { id: 'rm', name: 'Right Midfielder', group: 'MID', defaultPosition: 'RM', eligiblePositions: ['RM', 'RW'], coordinates: { x: 85, y: 46 } },
      { id: 'st', name: 'Target Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 50, y: 18 } },
    ],
  },
  '3-4-1-2': {
    id: '3-4-1-2',
    name: '3-4-1-2 Attack Overload',
    description: 'Dynamic back-three system with wide wing-backs, a trequartista, and twin strikers.',
    slots: [
      { id: 'gk', name: 'Goalkeeper', group: 'GK', defaultPosition: 'GK', eligiblePositions: ['GK'], coordinates: { x: 50, y: 92 } },
      { id: 'cb1', name: 'Left Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 28, y: 78 } },
      { id: 'cb2', name: 'Central Stopper', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 50, y: 80 } },
      { id: 'cb3', name: 'Right Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 72, y: 78 } },
      { id: 'lm', name: 'Left Wing-Back / Mid', group: 'MID', defaultPosition: 'LM', eligiblePositions: ['LM', 'LWB', 'LW'], coordinates: { x: 12, y: 50 } },
      { id: 'cm1', name: 'Left Central Midfielder', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CDM'], coordinates: { x: 38, y: 54 } },
      { id: 'cm2', name: 'Right Central Midfielder', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CAM', 'CDM'], coordinates: { x: 62, y: 54 } },
      { id: 'rm', name: 'Right Wing-Back / Mid', group: 'MID', defaultPosition: 'RM', eligiblePositions: ['RM', 'RWB', 'RW'], coordinates: { x: 88, y: 50 } },
      { id: 'cam', name: 'Central Trequartista', group: 'MID', defaultPosition: 'CAM', eligiblePositions: ['CAM', 'CM', 'SS'], coordinates: { x: 50, y: 35 } },
      { id: 'st1', name: 'Left Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 38, y: 18 } },
      { id: 'st2', name: 'Right Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 62, y: 18 } },
    ],
  },
};

export const DEFAULT_FORMATION_ID = '4-3-3';
export const FORMATION_PRESETS = FORMATIONS;

/**
 * Checks whether a player's natural or secondary positions qualify them for a given formation slot.
 * Safely defaults eligible positions from the slot's defaultPosition if eligiblePositions is not pre-populated.
 */
export function isPlayerEligibleForSlot(
  player: { naturalPositions?: Position[]; secondaryPositions?: Position[] },
  slot: { eligiblePositions?: Position[]; defaultPosition?: Position }
): boolean {
  if (!player || !slot) return false;
  const eligible =
    slot.eligiblePositions && slot.eligiblePositions.length > 0
      ? slot.eligiblePositions
      : slot.defaultPosition && ELIGIBLE_POSITIONS_MAP[slot.defaultPosition]
      ? ELIGIBLE_POSITIONS_MAP[slot.defaultPosition]
      : slot.defaultPosition
      ? [slot.defaultPosition]
      : [];

  const playerPositions = [
    ...(player.naturalPositions || []),
    ...(player.secondaryPositions || []),
  ];

  return playerPositions.some((pos) => eligible.includes(pos));
}

/**
 * Authoritative mapping from default position to eligible natural and secondary positions.
 */
export const ELIGIBLE_POSITIONS_MAP: Record<Position, Position[]> = {
   GK: ['GK'],
   CB: ['CB'],
   LB: ['LB', 'LWB'],
   RB: ['RB', 'RWB'],
   LWB: ['LWB', 'LB', 'LM'],
   RWB: ['RWB', 'RB', 'RM'],
   CDM: ['CDM', 'CM'],
   CM: ['CM', 'CDM', 'CAM'],
   CAM: ['CAM', 'CM', 'SS'],
   LM: ['LM', 'LW', 'CAM'],
   RM: ['RM', 'RW', 'CAM'],
   LW: ['LW', 'LM'],
   RW: ['RW', 'RM'],
   CF: ['CF', 'ST', 'SS', 'CAM'],
   SS: ['SS', 'CF', 'CAM', 'ST'],
   ST: ['ST', 'CF', 'SS'],
 };
 
 /**
  * Pre-defined tactical snap nodes across the pitch for Mode 2 (Magnetic Snap-to-Nodes).
  */
 export interface TacticalSnapNode {
   id: string;
   position: Position;
   name: string;
   group: PositionGroup;
   coordinates: { x: number; y: number };
 }
 
 export const TACTICAL_SNAP_NODES: TacticalSnapNode[] = [
   // Goalkeeper
   { id: 'node-gk', position: 'GK', name: 'Goalkeeper', group: 'GK', coordinates: { x: 50, y: 92 } },
   // Defensive line
   { id: 'node-lb', position: 'LB', name: 'Left Back', group: 'DEF', coordinates: { x: 15, y: 78 } },
   { id: 'node-cb-l', position: 'CB', name: 'Left Center Back', group: 'DEF', coordinates: { x: 34, y: 80 } },
   { id: 'node-cb-c', position: 'CB', name: 'Center Back', group: 'DEF', coordinates: { x: 50, y: 81 } },
   { id: 'node-cb-r', position: 'CB', name: 'Right Center Back', group: 'DEF', coordinates: { x: 66, y: 80 } },
   { id: 'node-rb', position: 'RB', name: 'Right Back', group: 'DEF', coordinates: { x: 85, y: 78 } },
   // Wing-backs
   { id: 'node-lwb', position: 'LWB', name: 'Left Wing-Back', group: 'DEF', coordinates: { x: 12, y: 66 } },
   { id: 'node-rwb', position: 'RWB', name: 'Right Wing-Back', group: 'DEF', coordinates: { x: 88, y: 66 } },
   // Defensive Midfield
   { id: 'node-cdm-l', position: 'CDM', name: 'Left Defensive Mid', group: 'MID', coordinates: { x: 38, y: 63 } },
   { id: 'node-cdm-c', position: 'CDM', name: 'Central Holding Mid', group: 'MID', coordinates: { x: 50, y: 64 } },
   { id: 'node-cdm-r', position: 'CDM', name: 'Right Defensive Mid', group: 'MID', coordinates: { x: 62, y: 63 } },
   // Central Midfield
   { id: 'node-lm', position: 'LM', name: 'Left Midfielder', group: 'MID', coordinates: { x: 15, y: 48 } },
   { id: 'node-cm-l', position: 'CM', name: 'Left Central Mid', group: 'MID', coordinates: { x: 34, y: 52 } },
   { id: 'node-cm-c', position: 'CM', name: 'Central Midfielder', group: 'MID', coordinates: { x: 50, y: 52 } },
   { id: 'node-cm-r', position: 'CM', name: 'Right Central Mid', group: 'MID', coordinates: { x: 66, y: 52 } },
   { id: 'node-rm', position: 'RM', name: 'Right Midfielder', group: 'MID', coordinates: { x: 85, y: 48 } },
   // Attacking Midfield
   { id: 'node-cam-l', position: 'CAM', name: 'Left Attacking Mid', group: 'MID', coordinates: { x: 32, y: 38 } },
   { id: 'node-cam-c', position: 'CAM', name: 'Central Playmaker', group: 'MID', coordinates: { x: 50, y: 38 } },
   { id: 'node-cam-r', position: 'CAM', name: 'Right Attacking Mid', group: 'MID', coordinates: { x: 68, y: 38 } },
   // Forward Line
   { id: 'node-lw', position: 'LW', name: 'Left Winger', group: 'FWD', coordinates: { x: 18, y: 22 } },
   { id: 'node-cf', position: 'CF', name: 'Center Forward', group: 'FWD', coordinates: { x: 50, y: 28 } },
   { id: 'node-rw', position: 'RW', name: 'Right Winger', group: 'FWD', coordinates: { x: 82, y: 22 } },
   { id: 'node-st-l', position: 'ST', name: 'Left Striker', group: 'FWD', coordinates: { x: 36, y: 18 } },
   { id: 'node-st-c', position: 'ST', name: 'Central Striker', group: 'FWD', coordinates: { x: 50, y: 16 } },
   { id: 'node-st-r', position: 'ST', name: 'Right Striker', group: 'FWD', coordinates: { x: 64, y: 18 } },
 ];
 
 /**
  * Calculates dynamic position name, group, and eligible positions
  * based on real-time pitch coordinates (X: 0-100%, Y: 0-100%).
  */
 export function calculatePositionFromCoordinates(x: number, y: number): {
   position: Position;
   group: PositionGroup;
   name: string;
   eligiblePositions: Position[];
 } {
   // Clamp coordinates to pitch bounds
   const cx = Math.max(5, Math.min(95, x));
   const cy = Math.max(8, Math.min(95, y));
 
   let position: Position = 'CM';
   let group: PositionGroup = 'MID';
   let name = 'Central Midfielder';
 
   if (cy >= 87) {
     position = 'GK';
     group = 'GK';
     name = 'Goalkeeper';
   } else if (cy >= 70) {
     group = 'DEF';
     if (cx <= 24) {
       position = 'LB';
       name = 'Left Back';
     } else if (cx >= 76) {
       position = 'RB';
       name = 'Right Back';
     } else {
       position = 'CB';
       name = cx < 46 ? 'Left Center Back' : cx > 54 ? 'Right Center Back' : 'Center Back';
     }
   } else if (cy >= 58) {
     if (cx <= 20) {
       position = 'LWB';
       group = 'DEF';
       name = 'Left Wing-Back';
     } else if (cx >= 80) {
       position = 'RWB';
       group = 'DEF';
       name = 'Right Wing-Back';
     } else {
       position = 'CDM';
       group = 'MID';
       name = cx < 46 ? 'Left Defensive Mid' : cx > 54 ? 'Right Defensive Mid' : 'Holding Midfielder';
     }
   } else if (cy >= 43) {
     group = 'MID';
     if (cx <= 22) {
       position = 'LM';
       name = 'Left Midfielder';
     } else if (cx >= 78) {
       position = 'RM';
       name = 'Right Midfielder';
     } else {
       position = 'CM';
       name = cx < 46 ? 'Left Central Mid' : cx > 54 ? 'Right Central Mid' : 'Central Midfielder';
     }
   } else if (cy >= 30) {
     group = 'MID';
     if (cx <= 25) {
       position = 'LM';
       name = 'Left Attacking Mid';
     } else if (cx >= 75) {
       position = 'RM';
       name = 'Right Attacking Mid';
     } else {
       position = 'CAM';
       name = 'Attacking Midfielder';
     }
   } else {
     // Attacking third (cy < 30)
     group = 'FWD';
     if (cx <= 28) {
       position = 'LW';
       name = 'Left Winger';
     } else if (cx >= 72) {
       position = 'RW';
       name = 'Right Winger';
     } else if (cy >= 22) {
       position = 'CF';
       name = 'Center Forward';
     } else {
       position = 'ST';
       name = cx < 46 ? 'Left Striker' : cx > 54 ? 'Right Striker' : 'Striker';
     }
   }
 
   const eligiblePositions = ELIGIBLE_POSITIONS_MAP[position] || [position];
 
   return { position, group, name, eligiblePositions };
 }
 
 /**
  * Finds the closest snap node for a given coordinate.
  */
 export function findClosestSnapNode(x: number, y: number, snapThreshold = 9): TacticalSnapNode | null {
   let closest: TacticalSnapNode | null = null;
   let minDistance = Infinity;
 
   for (const node of TACTICAL_SNAP_NODES) {
     const dx = node.coordinates.x - x;
     const dy = node.coordinates.y - y;
     const distance = Math.sqrt(dx * dx + dy * dy);
     if (distance < minDistance) {
       minDistance = distance;
       closest = node;
     }
   }
 
   return minDistance <= snapThreshold ? closest : null;
 }
 
 /**
  * Validates whether a custom formation configuration complies with football simulator rules:
  * 1. Exactly 11 players.
  * 2. Exactly 1 GK.
  * 3. 3-5 Defenders.
  * 4. 2-6 Midfielders.
  * 5. 1-4 Forwards.
  */
 export function validateCustomFormation(slots: FormationSlot[]): {
   valid: boolean;
   reason?: string;
   derivedName: string;
   counts: { gk: number; def: number; mid: number; fwd: number };
 } {
   const counts = { gk: 0, def: 0, mid: 0, fwd: 0 };
 
   for (const s of slots) {
     if (s.group === 'GK') counts.gk++;
     else if (s.group === 'DEF') counts.def++;
     else if (s.group === 'MID') counts.mid++;
     else if (s.group === 'FWD') counts.fwd++;
   }
 
   const derivedName = `${counts.def}-${counts.mid}-${counts.fwd}`;
 
   if (slots.length !== 11) {
     return { valid: false, reason: `Must have exactly 11 players (currently ${slots.length})`, derivedName, counts };
   }
 
   if (counts.gk !== 1) {
     return { valid: false, reason: `Must have exactly 1 Goalkeeper (currently ${counts.gk})`, derivedName, counts };
   }
 
   if (counts.def < 3 || counts.def > 5) {
     return { valid: false, reason: `Must have between 3 and 5 Defenders (currently ${counts.def})`, derivedName, counts };
   }
 
   if (counts.mid < 2 || counts.mid > 6) {
     return { valid: false, reason: `Must have between 2 and 6 Midfielders (currently ${counts.mid})`, derivedName, counts };
   }
 
   if (counts.fwd < 1 || counts.fwd > 4) {
     return { valid: false, reason: `Must have between 1 and 4 Forwards (currently ${counts.fwd})`, derivedName, counts };
   }
 
   return { valid: true, derivedName, counts };
 }
 
 /**
  * Generates balanced, proportional slot coordinates from Defender, Midfielder, Forward counts.
  */
 export function generateFormationFromLines(
   defCount: number,
   midCount: number,
   fwdCount: number,
   name?: string
 ): FormationDefinition {
   const slots: FormationSlot[] = [];
 
   // 1. Goalkeeper
   slots.push({
     id: 'gk',
     name: 'Goalkeeper',
     group: 'GK',
     defaultPosition: 'GK',
     eligiblePositions: ['GK'],
     coordinates: { x: 50, y: 92 },
   });
 
   // Helper to calculate X coordinates evenly across a line
   const getXCoords = (count: number, leftBound = 15, rightBound = 85): number[] => {
     if (count === 1) return [50];
     const step = (rightBound - leftBound) / (count - 1);
     return Array.from({ length: count }, (_, i) => Math.round(leftBound + i * step));
   };
 
   // 2. Defenders
   const defXs = getXCoords(defCount, 15, 85);
   defXs.forEach((x, i) => {
     const isLeft = i === 0 && defCount >= 4;
     const isRight = i === defCount - 1 && defCount >= 4;
     const pos: Position = isLeft ? 'LB' : isRight ? 'RB' : 'CB';
     const slotName = isLeft ? 'Left Back' : isRight ? 'Right Back' : `Center Back ${i + 1}`;
     slots.push({
       id: `def_${i + 1}`,
       name: slotName,
       group: 'DEF',
       defaultPosition: pos,
       eligiblePositions: ELIGIBLE_POSITIONS_MAP[pos],
       coordinates: { x, y: isLeft || isRight ? 76 : 79 },
     });
   });
 
   // 3. Midfielders
   const midXs = getXCoords(midCount, 18, 82);
   midXs.forEach((x, i) => {
     const isWideLeft = i === 0 && midCount >= 4;
     const isWideRight = i === midCount - 1 && midCount >= 4;
     const pos: Position = isWideLeft ? 'LM' : isWideRight ? 'RM' : 'CM';
     const slotName = isWideLeft ? 'Left Midfielder' : isWideRight ? 'Right Midfielder' : `Central Midfielder ${i + 1}`;
     slots.push({
       id: `mid_${i + 1}`,
       name: slotName,
       group: 'MID',
       defaultPosition: pos,
       eligiblePositions: ELIGIBLE_POSITIONS_MAP[pos],
       coordinates: { x, y: 52 },
     });
   });
 
   // 4. Forwards
   const fwdXs = getXCoords(fwdCount, 22, 78);
   fwdXs.forEach((x, i) => {
     const isWingerL = i === 0 && fwdCount === 3;
     const isWingerR = i === 2 && fwdCount === 3;
     const pos: Position = isWingerL ? 'LW' : isWingerR ? 'RW' : 'ST';
     const slotName = isWingerL ? 'Left Winger' : isWingerR ? 'Right Winger' : `Striker ${i + 1}`;
     slots.push({
       id: `fwd_${i + 1}`,
       name: slotName,
       group: 'FWD',
       defaultPosition: pos,
       eligiblePositions: ELIGIBLE_POSITIONS_MAP[pos],
       coordinates: { x, y: isWingerL || isWingerR ? 22 : 18 },
     });
   });
 
   const formationName = name || `${defCount}-${midCount}-${fwdCount} Custom`;
 
   return {
     id: `custom-${Date.now().toString(36)}`,
     name: formationName,
     description: `Custom ${defCount}-${midCount}-${fwdCount} tactical setup.`,
     slots,
     isCustom: true,
   };
 }
 
 /**
  * Archetype preset formations available as 1-click starting templates in Custom Formation Studio.
  */
 export const ARCHETYPE_TEMPLATES: FormationDefinition[] = [
   FORMATIONS['4-3-3'],
   FORMATIONS['4-4-2'],
   FORMATIONS['4-2-3-1'],
   FORMATIONS['3-5-2'],
   {
     id: '3-4-3',
     name: '3-4-3 Diamond',
     description: 'Cruyff-inspired total football diamond with fluid attacking wingers.',
     slots: [
       { id: 'gk', name: 'Goalkeeper', group: 'GK', defaultPosition: 'GK', eligiblePositions: ['GK'], coordinates: { x: 50, y: 92 } },
       { id: 'cb1', name: 'Left Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 28, y: 78 } },
       { id: 'cb2', name: 'Sweeper / Central Stopper', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 50, y: 80 } },
       { id: 'cb3', name: 'Right Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 72, y: 78 } },
       { id: 'cdm', name: 'Defensive Anchor', group: 'MID', defaultPosition: 'CDM', eligiblePositions: ['CDM', 'CM'], coordinates: { x: 50, y: 64 } },
       { id: 'lm', name: 'Left Wide Midfielder', group: 'MID', defaultPosition: 'LM', eligiblePositions: ['LM', 'LW'], coordinates: { x: 18, y: 48 } },
       { id: 'rm', name: 'Right Wide Midfielder', group: 'MID', defaultPosition: 'RM', eligiblePositions: ['RM', 'RW'], coordinates: { x: 82, y: 48 } },
       { id: 'cam', name: 'Diamond Apex Playmaker', group: 'MID', defaultPosition: 'CAM', eligiblePositions: ['CAM', 'CM', 'SS'], coordinates: { x: 50, y: 36 } },
       { id: 'lw', name: 'Left Winger', group: 'FWD', defaultPosition: 'LW', eligiblePositions: ['LW', 'LM'], coordinates: { x: 22, y: 20 } },
       { id: 'st', name: 'Central Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 50, y: 16 } },
       { id: 'rw', name: 'Right Winger', group: 'FWD', defaultPosition: 'RW', eligiblePositions: ['RW', 'RM'], coordinates: { x: 78, y: 20 } },
     ],
   },
   {
     id: '4-2-4',
     name: '4-2-4 Brazil Overload',
     description: 'Legendary 1958/1970 4-2-4 system featuring dual strikers and dynamic wingers.',
     slots: [
       { id: 'gk', name: 'Goalkeeper', group: 'GK', defaultPosition: 'GK', eligiblePositions: ['GK'], coordinates: { x: 50, y: 92 } },
       { id: 'lb', name: 'Left Back', group: 'DEF', defaultPosition: 'LB', eligiblePositions: ['LB', 'LWB'], coordinates: { x: 15, y: 76 } },
       { id: 'cb1', name: 'Left Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 38, y: 79 } },
       { id: 'cb2', name: 'Right Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 62, y: 79 } },
       { id: 'rb', name: 'Right Back', group: 'DEF', defaultPosition: 'RB', eligiblePositions: ['RB', 'RWB'], coordinates: { x: 85, y: 76 } },
       { id: 'cm1', name: 'Holding Midfielder', group: 'MID', defaultPosition: 'CDM', eligiblePositions: ['CDM', 'CM'], coordinates: { x: 38, y: 55 } },
       { id: 'cm2', name: 'Box-to-Box Midfielder', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CAM'], coordinates: { x: 62, y: 55 } },
       { id: 'lw', name: 'Left Winger', group: 'FWD', defaultPosition: 'LW', eligiblePositions: ['LW', 'LM'], coordinates: { x: 18, y: 24 } },
       { id: 'st1', name: 'Second Striker', group: 'FWD', defaultPosition: 'SS', eligiblePositions: ['SS', 'CF', 'ST'], coordinates: { x: 40, y: 18 } },
       { id: 'st2', name: 'Center Forward', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF'], coordinates: { x: 60, y: 18 } },
       { id: 'rw', name: 'Right Winger', group: 'FWD', defaultPosition: 'RW', eligiblePositions: ['RW', 'RM'], coordinates: { x: 82, y: 24 } },
     ],
   },
   {
     id: '5-3-2',
     name: '5-3-2 Solid Wall',
     description: 'Defensive powerhouse with 3 central defenders, attacking wing-backs, and twin target men.',
     slots: [
       { id: 'gk', name: 'Goalkeeper', group: 'GK', defaultPosition: 'GK', eligiblePositions: ['GK'], coordinates: { x: 50, y: 92 } },
       { id: 'lwb', name: 'Left Wing-Back', group: 'DEF', defaultPosition: 'LWB', eligiblePositions: ['LWB', 'LB'], coordinates: { x: 12, y: 68 } },
       { id: 'cb1', name: 'Left Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 30, y: 80 } },
       { id: 'cb2', name: 'Sweeper', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 50, y: 82 } },
       { id: 'cb3', name: 'Right Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 70, y: 80 } },
       { id: 'rwb', name: 'Right Wing-Back', group: 'DEF', defaultPosition: 'RWB', eligiblePositions: ['RWB', 'RB'], coordinates: { x: 88, y: 68 } },
       { id: 'cm1', name: 'Left Central Mid', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CDM'], coordinates: { x: 34, y: 52 } },
       { id: 'cm2', name: 'Anchor Midfielder', group: 'MID', defaultPosition: 'CDM', eligiblePositions: ['CDM', 'CM'], coordinates: { x: 50, y: 55 } },
       { id: 'cm3', name: 'Right Central Mid', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CDM'], coordinates: { x: 66, y: 52 } },
       { id: 'st1', name: 'Left Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF'], coordinates: { x: 40, y: 18 } },
       { id: 'st2', name: 'Right Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF'], coordinates: { x: 60, y: 18 } },
     ],
   },
   {
     id: '4-1-4-1',
     name: '4-1-4-1 Dominant Press',
     description: 'Single defensive pivot with a high-pressing midfield quartet.',
     slots: [
       { id: 'gk', name: 'Goalkeeper', group: 'GK', defaultPosition: 'GK', eligiblePositions: ['GK'], coordinates: { x: 50, y: 92 } },
       { id: 'lb', name: 'Left Back', group: 'DEF', defaultPosition: 'LB', eligiblePositions: ['LB', 'LWB'], coordinates: { x: 15, y: 76 } },
       { id: 'cb1', name: 'Left Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 38, y: 79 } },
       { id: 'cb2', name: 'Right Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 62, y: 79 } },
       { id: 'rb', name: 'Right Back', group: 'DEF', defaultPosition: 'RB', eligiblePositions: ['RB', 'RWB'], coordinates: { x: 85, y: 76 } },
       { id: 'cdm', name: 'Holding Pivot', group: 'MID', defaultPosition: 'CDM', eligiblePositions: ['CDM', 'CM'], coordinates: { x: 50, y: 64 } },
       { id: 'lm', name: 'Left Midfielder', group: 'MID', defaultPosition: 'LM', eligiblePositions: ['LM', 'LW'], coordinates: { x: 18, y: 44 } },
       { id: 'cm1', name: 'Left Central Mid', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CAM'], coordinates: { x: 38, y: 46 } },
       { id: 'cm2', name: 'Right Central Mid', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CAM'], coordinates: { x: 62, y: 46 } },
       { id: 'rm', name: 'Right Midfielder', group: 'MID', defaultPosition: 'RM', eligiblePositions: ['RM', 'RW'], coordinates: { x: 82, y: 44 } },
       { id: 'st', name: 'Target Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 50, y: 16 } },
     ],
   },
     {
      id: '4-3-1-2',
      name: '4-3-1-2 Narrow Diamond',
      description: 'Ancelotti-style compact midfield diamond behind dual center forwards.',
      slots: [
        { id: 'gk', name: 'Goalkeeper', group: 'GK', defaultPosition: 'GK', eligiblePositions: ['GK'], coordinates: { x: 50, y: 92 } },
        { id: 'lb', name: 'Left Back', group: 'DEF', defaultPosition: 'LB', eligiblePositions: ['LB', 'LWB'], coordinates: { x: 15, y: 76 } },
        { id: 'cb1', name: 'Left Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 38, y: 79 } },
        { id: 'cb2', name: 'Right Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 62, y: 79 } },
        { id: 'rb', name: 'Right Back', group: 'DEF', defaultPosition: 'RB', eligiblePositions: ['RB', 'RWB'], coordinates: { x: 85, y: 76 } },
        { id: 'cdm', name: 'Deep Regista', group: 'MID', defaultPosition: 'CDM', eligiblePositions: ['CDM', 'CM'], coordinates: { x: 50, y: 64 } },
        { id: 'cm1', name: 'Left Mezzala', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CDM'], coordinates: { x: 32, y: 52 } },
        { id: 'cm2', name: 'Right Mezzala', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CDM'], coordinates: { x: 68, y: 52 } },
        { id: 'cam', name: 'Apex Trequartista', group: 'MID', defaultPosition: 'CAM', eligiblePositions: ['CAM', 'CM', 'SS'], coordinates: { x: 50, y: 36 } },
        { id: 'st1', name: 'Left Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 38, y: 18 } },
        { id: 'st2', name: 'Right Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF', 'SS'], coordinates: { x: 62, y: 18 } },
      ],
    },
    {
      id: '5-2-3',
      name: '5-2-3 Total Counter',
      description: 'Ultra-resilient 5-man backline with devastating dynamic 3-man counter-attack.',
      slots: [
        { id: 'gk', name: 'Goalkeeper', group: 'GK', defaultPosition: 'GK', eligiblePositions: ['GK'], coordinates: { x: 50, y: 92 } },
        { id: 'lwb', name: 'Left Wing-Back', group: 'DEF', defaultPosition: 'LWB', eligiblePositions: ['LWB', 'LB'], coordinates: { x: 12, y: 66 } },
        { id: 'cb1', name: 'Left Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 30, y: 80 } },
        { id: 'cb2', name: 'Central Sweeper', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 50, y: 82 } },
        { id: 'cb3', name: 'Right Center Back', group: 'DEF', defaultPosition: 'CB', eligiblePositions: ['CB'], coordinates: { x: 70, y: 80 } },
        { id: 'rwb', name: 'Right Wing-Back', group: 'DEF', defaultPosition: 'RWB', eligiblePositions: ['RWB', 'RB'], coordinates: { x: 88, y: 66 } },
        { id: 'cm1', name: 'Left Mid Engine', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CDM'], coordinates: { x: 38, y: 52 } },
        { id: 'cm2', name: 'Right Mid Engine', group: 'MID', defaultPosition: 'CM', eligiblePositions: ['CM', 'CDM'], coordinates: { x: 62, y: 52 } },
        { id: 'lw', name: 'Left Winger', group: 'FWD', defaultPosition: 'LW', eligiblePositions: ['LW', 'LM'], coordinates: { x: 20, y: 22 } },
        { id: 'st', name: 'Counter Striker', group: 'FWD', defaultPosition: 'ST', eligiblePositions: ['ST', 'CF'], coordinates: { x: 50, y: 16 } },
        { id: 'rw', name: 'Right Winger', group: 'FWD', defaultPosition: 'RW', eligiblePositions: ['RW', 'RM'], coordinates: { x: 80, y: 22 } },
      ],
    },
];

/**
 * Standard 6-player matchday bench slots for drafting.
 * Combined with the 11 formation starting XI slots, each manager drafts exactly 17 players.
 */
export const MATCHDAY_BENCH_SLOTS: FormationSlot[] = [
  {
    id: 'sub-gk',
    name: 'Backup Goalkeeper',
    group: 'GK',
    defaultPosition: 'GK',
    eligiblePositions: ['GK'],
    coordinates: { x: 10, y: 100 },
  },
  {
    id: 'sub-def-1',
    name: 'Reserve Defender 1',
    group: 'DEF',
    defaultPosition: 'CB',
    eligiblePositions: ['CB', 'LB', 'RB', 'LWB', 'RWB'],
    coordinates: { x: 26, y: 100 },
  },
  {
    id: 'sub-def-2',
    name: 'Reserve Defender 2',
    group: 'DEF',
    defaultPosition: 'LB',
    eligiblePositions: ['CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM'],
    coordinates: { x: 42, y: 100 },
  },
  {
    id: 'sub-mid-1',
    name: 'Reserve Midfielder 1',
    group: 'MID',
    defaultPosition: 'CM',
    eligiblePositions: ['CM', 'CDM', 'CAM', 'LM', 'RM'],
    coordinates: { x: 58, y: 100 },
  },
  {
    id: 'sub-mid-2',
    name: 'Reserve Midfielder 2',
    group: 'MID',
    defaultPosition: 'CAM',
    eligiblePositions: ['CAM', 'CM', 'CDM', 'LM', 'RM', 'LW', 'RW'],
    coordinates: { x: 74, y: 100 },
  },
  {
    id: 'sub-fwd-1',
    name: 'Reserve Forward',
    group: 'FWD',
    defaultPosition: 'ST',
    eligiblePositions: ['ST', 'CF', 'SS', 'LW', 'RW', 'CAM'],
    coordinates: { x: 90, y: 100 },
  },
];

export const TOTAL_DRAFT_ROUNDS = 17; // 11 Starters + 6 Substitutes

