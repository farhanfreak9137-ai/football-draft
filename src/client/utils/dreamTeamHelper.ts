import {
  PlayerDraftState,
  PlayerVersion,
  PoolType,
  SavedDreamTeam,
  TeamEdition,
} from '../../shared/types/index.js';
import { FORMATIONS } from '../../shared/constants/formations.js';
import { DraftEngine } from '../../shared/engine/draftEngine.js';

export function getEditionCaliber(edition: TeamEdition, players: PlayerVersion[]): number {
  const edPlayers = players.filter((p) => p.editionId === edition.id);
  if (edPlayers.length === 0) return 80;
  const top11 = [...edPlayers].sort((a, b) => b.ovr - a.ovr).slice(0, 11);
  return Math.round(top11.reduce((sum, p) => sum + p.ovr, 0) / top11.length);
}

export function convertDraftStateToDreamTeam(
  draft: PlayerDraftState,
  name?: string
): SavedDreamTeam {
  const playersList = Object.values(draft.draftedSlots).map((s) => s.player);
  const totalOvr =
    playersList.length > 0
      ? Math.round(playersList.reduce((acc, p) => acc + p.ovr, 0) / playersList.length)
      : 80;

  return {
    name: name || draft.playerName || 'My Dream XI',
    formationId: draft.formation.id,
    customFormation: draft.formation.isCustom ? draft.formation : undefined,
    draftedSlots: { ...draft.draftedSlots },
    totalOvr,
    savedAt: Date.now(),
  };
}

export function convertDreamTeamToDraftState(
  dreamTeam: SavedDreamTeam,
  poolType: PoolType = 'national'
): PlayerDraftState {
  const formation =
    dreamTeam.customFormation || FORMATIONS[dreamTeam.formationId] || FORMATIONS['4-3-3'];

  const draftState = DraftEngine.createInitialDraftState({
    seatId: 'host',
    playerId: 'user-manager',
    playerName: dreamTeam.name || 'My Dream XI',
    poolType,
    formationId: formation.id,
  });

  draftState.draftedSlots = { ...dreamTeam.draftedSlots };
  draftState.usedIdentityIds = [
    ...Object.values(dreamTeam.draftedSlots).map((s) => s.player.identityId),
    ...Object.values(dreamTeam.benchSlots || {}).map((s) => s.player.identityId),
  ];
  draftState.roles = dreamTeam.roles;
  draftState.isReady = true;

  return draftState;
}

