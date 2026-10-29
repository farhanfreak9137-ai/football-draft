import React from 'react';
import { PlayerVersion } from '../../shared/types/index.js';
import { getPositionBadgeClass } from '../utils/positionCategory.js';
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
  isCompact = false,
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
          ? `${player.name} (★ ${player.legendSealReason}) - ${positions} - OVR ${player.ovr}`
          : `${player.name} (${positions}) - OVR ${player.ovr}`
      }
      className={`w-full flex items-center justify-between ${
        isCompact ? 'px-2 py-1' : 'px-2.5 py-1.5 sm:py-1'
      } rounded-lg border text-left transition-all select-none ${
        isTakenByOpponent
          ? 'bg-rose-950/20 border-rose-900/40 opacity-45 cursor-not-allowed'
          : isSelected
          ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-400/80 shadow-[0_0_14px_rgba(16,185,129,0.35)] scale-[1.01] cursor-pointer'
          : eligible && !disabled
          ? player.ovr >= 95
            ? 'bg-gradient-to-r from-tactical-850 via-amber-950/30 to-tactical-850 border-amber-400/60 hover:bg-tactical-800 hover:border-amber-300 hover:shadow-[0_0_12px_rgba(245,158,11,0.3)] cursor-pointer active:scale-[0.99]'
            : player.ovr >= 90
            ? 'bg-tactical-850/90 border-amber-500/40 hover:bg-tactical-800 hover:border-amber-400 hover:shadow-[0_0_8px_rgba(245,158,11,0.2)] cursor-pointer active:scale-[0.99]'
            : 'bg-tactical-850/90 border-tactical-700/70 hover:bg-tactical-800 hover:border-emerald-500/50 hover:shadow-xs cursor-pointer active:scale-[0.99]'
          : 'bg-tactical-900/40 border-tactical-800/40 opacity-40 cursor-not-allowed'
      }`}
    >
      {/* Left side: 10. Messi RW/ST */}
      <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-1.5">
        <span
          className={`font-mono font-bold text-[10px] sm:text-[11px] w-4.5 sm:w-5 shrink-0 text-left ${
            isSelected ? 'text-emerald-400' : 'text-tactical-400'
          }`}
        >
          {player.squadNumber}.
        </span>
        <span
          className={`font-semibold text-xs truncate tracking-tight ${
            isSelected ? 'text-emerald-200 font-bold' : 'text-tactical-100'
          }`}
        >
          {player.name}
        </span>
        <span
          className={`font-mono text-[8.5px] sm:text-[9px] px-1.5 py-0.5 rounded font-bold tracking-tight shrink-0 uppercase ${getPositionBadgeClass(
            player.naturalPositions[0] || 'CM'
          )}`}
        >
          {isCompact && player.naturalPositions.length > 0 ? player.naturalPositions.join('/') : positions}
        </span>
        {player.hasLegendSeal && (
          <span
            className={`text-xs shrink-0 ${
              player.ovr >= 95 ? 'text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)] animate-pulse' : 'text-gold-400'
            }`}
            title={player.legendSealReason}
          >
            ★
          </span>
        )}
      </div>

      {/* Right side: Taken badge and OVR */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {isTakenByOpponent && (
          <span className="font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1 sm:px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-600/70 text-rose-300">
            {isCompact ? 'Taken' : 'Taken by Opponent'}
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
