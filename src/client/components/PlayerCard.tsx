import React from 'react';
import { PlayerVersion } from '../../shared/types/index.js';

interface PlayerCardProps {
  player: PlayerVersion;
  eligible?: boolean;
  isSelected?: boolean;
  onPick?: () => void;
  disabled?: boolean;
  ineligibleReason?: string;
  isCompact?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  eligible = true,
  isSelected = false,
  onPick,
  disabled = false,
  ineligibleReason,
}) => {
  const positions = [...player.naturalPositions, ...player.secondaryPositions].join('/');

  return (
    <button
      type="button"
      onClick={eligible && onPick && !disabled ? onPick : undefined}
      disabled={!eligible || disabled}
      title={
        !eligible
          ? ineligibleReason
          : player.hasLegendSeal
          ? `${player.name} (★ ${player.legendSealReason})`
          : undefined
      }
      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded border text-left transition-all select-none ${
        isSelected
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

      {/* Right side: 99 */}
      <span
        className={`font-mono font-bold text-xs shrink-0 ${
          isSelected
            ? 'text-emerald-300 font-extrabold'
            : player.ovr >= 95
            ? 'text-amber-300'
            : player.ovr >= 90
            ? 'text-emerald-300'
            : 'text-tactical-200'
        }`}
      >
        {player.ovr}
      </span>
    </button>
  );
};
