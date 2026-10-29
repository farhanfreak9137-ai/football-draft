import React from 'react';
import { DraftedSlot } from '../../shared/types/index.js';
import { MATCHDAY_BENCH_SLOTS } from '../../shared/constants/formations.js';
import { Award, Sparkles, UserPlus } from 'lucide-react';

interface DraftBenchShelfProps {
  benchSlots: Record<string, DraftedSlot>;
  highlightedSlotIds?: string[];
  onSlotSelect?: (slotId: string) => void;
  interactive?: boolean;
  selectedPlayerName?: string | null;
  teamName?: string;
}

export const DraftBenchShelf: React.FC<DraftBenchShelfProps> = ({
  benchSlots,
  highlightedSlotIds = [],
  onSlotSelect,
  interactive = true,
  selectedPlayerName = null,
  teamName,
}) => {
  const draftedCount = Object.keys(benchSlots || {}).length;

  const getSlotRoleIcon = (slotId: string) => {
    if (slotId === 'sub-gk') return '🧤';
    if (slotId.includes('def')) return '🛡️';
    if (slotId.includes('mid')) return '🧠';
    return '⚡';
  };

  const getShortName = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length <= 1) return fullName;
    return parts[parts.length - 1];
  };

  return (
    <div className="bg-tactical-850/95 border border-tactical-700/80 rounded-2xl p-3.5 sm:p-4 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-base">
            🪑
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-tactical-100 flex items-center gap-2">
              <span>{teamName ? `${teamName}'s Bench` : 'Matchday Bench Reserves'}</span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-tactical-800 text-emerald-300 border border-emerald-500/30">
                {draftedCount}/6 Drafted
              </span>
            </h4>
            <p className="text-[10px] sm:text-[11px] text-tactical-400">
              Tactical reserves for in-match substitutions, cautions & fresh-legs rating surges.
            </p>
          </div>
        </div>

        {selectedPlayerName && interactive && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/90 border border-emerald-400 text-emerald-200 text-[11px] shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tap highlighted slot for <strong>{selectedPlayerName}</strong></span>
          </div>
        )}
      </div>

      {/* Grid of 6 Bench Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {MATCHDAY_BENCH_SLOTS.map((slot) => {
          const drafted = benchSlots?.[slot.id];
          const isHighlighted = highlightedSlotIds.includes(slot.id);
          const hasAnyHighlight = highlightedSlotIds.length > 0;

          const handleClick = () => {
            if (interactive && onSlotSelect && !drafted) {
              if (hasAnyHighlight && !isHighlighted) return;
              onSlotSelect(slot.id);
            }
          };

          return (
            <div
              key={slot.id}
              onClick={handleClick}
              className={`relative rounded-lg p-2.5 flex flex-col justify-between transition-all duration-200 border ${
                drafted
                  ? 'bg-tactical-800/90 border-tactical-650 shadow-sm'
                  : isHighlighted
                  ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-400/80 shadow-[0_0_12px_rgba(52,211,153,0.5)] cursor-pointer hover:scale-102 animate-pulse'
                  : interactive && hasAnyHighlight
                  ? 'bg-tactical-900/40 border-tactical-800 opacity-40 cursor-not-allowed'
                  : 'bg-tactical-900/60 border-tactical-750 border-dashed hover:border-tactical-600'
              }`}
            >
              {/* Header inside slot */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-tactical-400 flex items-center gap-1">
                  <span>{getSlotRoleIcon(slot.id)}</span>
                  <span className="truncate">{slot.name.replace('Reserve ', 'Sub ')}</span>
                </span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-tactical-900 text-tactical-300 border border-tactical-700">
                  {slot.defaultPosition}
                </span>
              </div>

              {drafted ? (
                // Drafted Bench Player
                <div className="flex items-center gap-2 mt-0.5">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex flex-col items-center justify-center font-mono font-black text-xs shrink-0 border shadow-sm ${
                      drafted.player.ovr >= 95
                        ? 'bg-tactical-900 border-amber-300 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                        : drafted.player.ovr >= 90
                        ? 'bg-tactical-900 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                        : 'bg-tactical-900 border-pitch-accent text-emerald-300 shadow-pitch-accent/20'
                    }`}
                  >
                    <span className="leading-tight">{drafted.player.ovr}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-tactical-100 truncate block">
                        {getShortName(drafted.player.name)}
                      </span>
                      {drafted.player.hasLegendSeal && (
                        <Award className="w-3 h-3 text-gold-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-pitch-accent leading-none block truncate">
                      #{drafted.player.squadNumber} • {drafted.assignedPosition}
                    </span>
                  </div>
                </div>
              ) : (
                // Empty Bench Slot
                <div className="py-2 text-center">
                  {isHighlighted ? (
                    <div className="flex flex-col items-center gap-0.5">
                      <UserPlus className="w-4 h-4 text-emerald-400 animate-bounce" />
                      <span className="text-[10px] font-bold text-emerald-300">Assign Sub</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-mono text-tactical-500 block">
                      Empty Sub
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

