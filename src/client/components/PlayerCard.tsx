import React from 'react';
import { PlayerVersion } from '../../shared/types/index.js';

import { getOvrColorClass } from '../utils/ovrColor.js';
export { getOvrColorClass };

interface PlayerCardProps {
  player: PlayerVersion;
  eligible?: boolean;
  isSelected?: boolean;
  onPick?: () => void;
  disabled?: boolean;
  ineligibleReason?: string;
  isTakenByOpponent?: boolean;
  isCompact?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  eligible = true,
  isSelected = false,
  onPick,
  disabled = false,
  ineligibleReason,
  isTakenByOpponent = false,
}) => {
  const positions = [...player.naturalPositions, ...player.secondaryPositions].join('/');

  return (
    <button
      type="button"
      onClick={eligible && onPick && !disabled && !isTakenByOpponent ? onPick : undefined}
      disabled={!eligible || disabled || isTakenByOpponent}
      title={
        isTakenByOpponent
          ? 'Already drafted by opponent (22 unique players rule)'
          : !eligible
          ? ineligibleReason
          : player.hasLegendSeal
          ? `${player.name} (★ ${player.legendSealReason})`
          : undefined
      }
      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded border text-left transition-all select-none ${
        isTakenByOpponent
          ? 'bg-rose-950/30 border-rose-900/50 opacity-45 cursor-not-allowed'
          : isSelected
          ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-400/90 shadow-lg scale-[1.01] cursor-pointer'
          : eligible && !disabled
          ? 'bg-tactical-800/90 border-tactical-700 hover:bg-tactical-750 hover:border-pitch-line/80 hover:shadow-sm cursor-pointer active:scale-[0.99]'
          : 'bg-tactical-900/40 border-tactical-800/40 opacity-40 cursor-not-allowed'
      }`}
    >
      {/* Left side: 10. Messi RW/ST */}
      <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-2">
        <span
          className={`font-mono font-semibold text-[11px] w-6 shrink-0 text-left ${
            isSelected ? 'text-emerald-400 font-bold' : 'text-tactical-400'
          }`}
        >
          {player.squadNumber}.
        </span>
        <span
          className={`font-medium text-xs truncate ${
            isSelected ? 'text-emerald-200 font-bold' : 'text-tactical-100'
          }`}
        >
          {player.name}
        </span>
        <span className="font-mono text-[10px] text-pitch-accent shrink-0">
          {positions}
        </span>
        {player.hasLegendSeal && (
          <span className="text-gold-400 text-[10px] shrink-0" title={player.legendSealReason}>
            ★
          </span>
        )}
      </div>

      {/* Right side: Taken badge and OVR */}
      <div className="flex items-center gap-1.5 shrink-0">
        {isTakenByOpponent && (
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-600/70 text-rose-300">
            Taken by Opponent
          </span>
        )}
        <span
          className={`font-mono font-bold text-xs shrink-0 ${
            isSelected
              ? 'text-emerald-300 font-extrabold'
              : isTakenByOpponent
              ? 'text-rose-400/60 line-through'
              : getOvrColorClass(player.ovr)
          }`}
        >
          {player.ovr}
        </span>
      </div>
    </button>
  );
};
