import React from 'react';
import { DraftedSlot, FormationDefinition, FormationSlot } from '../../shared/types/index.js';
import { Award, User } from 'lucide-react';
import { getOvrColorClass } from '../utils/ovrColor.js';

interface TacticalPitchProps {
  formation: FormationDefinition;
  draftedSlots: Record<string, DraftedSlot>;
  selectedSlotId: string | null;
  highlightedSlotIds?: string[];
  onSlotSelect?: (slotId: string) => void;
  interactive?: boolean;
}

export const TacticalPitch: React.FC<TacticalPitchProps> = ({
  formation,
  draftedSlots,
  selectedSlotId,
  highlightedSlotIds = [],
  onSlotSelect,
  interactive = true,
}) => {
  return (
    <div className="relative w-full aspect-[3/4] max-h-[580px] rounded-lg tactical-pitch-bg shadow-inner overflow-hidden select-none">
      {/* Pitch markings */}
      {/* Halfway line */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-pitch-line -translate-y-1/2 pointer-events-none" />
      {/* Center circle */}
      <div className="absolute top-1/2 left-1/2 w-28 h-28 border-2 border-pitch-line rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-pitch-line rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Top Penalty Area (Opponent side) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 border-b-2 border-x-2 border-pitch-line pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-8 border-b-2 border-x-2 border-pitch-line pointer-events-none" />

      {/* Bottom Penalty Area (Our side) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-20 border-t-2 border-x-2 border-pitch-line pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-8 border-t-2 border-x-2 border-pitch-line pointer-events-none" />

      {/* Formation Slots */}
      {formation.slots.map((slot) => {
        const drafted = draftedSlots[slot.id];
        const isSelected = selectedSlotId === slot.id;
        const isHighlighted = highlightedSlotIds.includes(slot.id);
        const hasAnyHighlight = highlightedSlotIds.length > 0;

        const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
          if (interactive && onSlotSelect && !drafted) {
            if (hasAnyHighlight && !isHighlighted) return;
            e.stopPropagation();
            onSlotSelect(slot.id);
          }
        };

        return (
          <div
            key={slot.id}
            style={{
              left: `${slot.coordinates.x}%`,
              top: `${slot.coordinates.y}%`,
            }}
            onClick={handleClick}
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none transition-all ${
              interactive && !drafted
                ? isHighlighted
                  ? 'cursor-pointer z-30 scale-110 hover:scale-125'
                  : hasAnyHighlight
                  ? 'cursor-not-allowed opacity-30 z-10'
                  : 'cursor-pointer z-20 hover:scale-105 active:scale-95'
                : hasAnyHighlight
                ? 'opacity-60 z-10'
                : 'z-10'
            }`}
          >
            {drafted ? (
              // Drafted Player Token
              <div
                className={`relative flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full border-2 shadow-lg transition-transform ${
                  drafted.player.ovr >= 95
                    ? 'bg-tactical-800 border-red-500 ring-2 ring-red-500/40 shadow-[0_0_14px_rgba(239,68,68,0.5)]'
                    : drafted.player.ovr >= 90 || drafted.player.hasLegendSeal
                    ? 'bg-tactical-800 border-gold-500 shadow-gold-500/20'
                    : 'bg-tactical-800 border-pitch-accent shadow-pitch-accent/20'
                }`}
              >
                <span className={`font-mono font-bold text-xs ${getOvrColorClass(drafted.player.ovr)}`}>
                  {drafted.player.ovr}
                </span>
                <span className="font-mono text-[10px] text-pitch-accent font-semibold">
                  {drafted.assignedPosition}
                </span>
                {drafted.player.hasLegendSeal && (
                  <Award
                    className={`absolute -top-1 -right-1 w-4 h-4 ${
                      drafted.player.ovr >= 95
                        ? 'text-red-400 fill-red-500/30'
                        : 'text-gold-400 fill-gold-500/30'
                    }`}
                  />
                )}
              </div>
            ) : (
              // Empty Slot Token
              <div
                className={`flex flex-col items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border-2 transition-all duration-300 ${
                  isHighlighted
                    ? 'bg-emerald-500/40 border-emerald-300 ring-4 ring-emerald-400/90 shadow-[0_0_30px_rgba(52,211,153,0.9)] animate-pulse'
                    : isSelected
                    ? 'bg-pitch-accent/30 border-pitch-accent scale-110 shadow-lg shadow-pitch-accent/40'
                    : 'bg-tactical-900/60 border-tactical-500 hover:border-tactical-300 border-dashed'
                }`}
              >
                <span
                  className={`font-mono font-bold text-xs ${
                    isHighlighted ? 'text-emerald-100 font-extrabold text-sm' : 'text-tactical-200'
                  }`}
                >
                  {slot.defaultPosition}
                </span>
              </div>
            )}

            {/* Label below token */}
            <div
              className={`mt-1 px-1.5 py-0.5 rounded text-center max-w-[95px] truncate transition-all ${
                isHighlighted
                  ? 'bg-emerald-950 border-2 border-emerald-400 text-emerald-300 shadow-xl font-bold text-[10px] scale-105'
                  : 'bg-tactical-900/80 border border-tactical-700/60 text-tactical-100 text-[10px]'
              }`}
            >
              <span className="truncate block font-medium">
                {drafted
                  ? drafted.player.name
                  : isHighlighted
                  ? 'Tap to Place'
                  : slot.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

