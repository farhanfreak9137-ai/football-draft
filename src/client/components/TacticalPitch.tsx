import React from 'react';
import { DraftedSlot, FormationDefinition } from '../../shared/types/index.js';
import { Award } from 'lucide-react';
import { getOvrColorClass } from '../utils/ovrColor.js';

interface TacticalPitchProps {
  formation: FormationDefinition;
  draftedSlots: Record<string, DraftedSlot>;
  selectedSlotId?: string | null;
  highlightedSlotIds?: string[];
  onSlotSelect?: (slotId: string) => void;
  interactive?: boolean;
}

export const TacticalPitch: React.FC<TacticalPitchProps> = ({
  formation,
  draftedSlots,
  selectedSlotId = null,
  highlightedSlotIds = [],
  onSlotSelect,
  interactive = true,
}) => {
  // Helper to extract a clean, compact display name on mobile screens
  const getShortName = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length <= 1) return fullName;
    return parts[parts.length - 1]; // Last name for clean fit
  };

  return (
    <div className="relative w-full aspect-[3/4] max-h-[460px] sm:max-h-[560px] rounded-2xl tactical-pitch-bg shadow-2xl overflow-hidden select-none border-2 border-pitch-line-solid/40">
      {/* Corner Arcs */}
      <div className="absolute top-0 left-0 w-4 h-4 border-b border-r border-pitch-line rounded-br-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-4 h-4 border-b border-l border-pitch-line rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-t border-r border-pitch-line rounded-tr-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-t border-l border-pitch-line rounded-tl-full pointer-events-none" />

      {/* Pitch markings */}
      {/* Halfway line */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-pitch-line -translate-y-1/2 pointer-events-none" />
      {/* Center circle */}
      <div className="absolute top-1/2 left-1/2 w-20 h-20 sm:w-28 sm:h-28 border-2 border-pitch-line rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-pitch-line rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Top Penalty Area (Opponent side) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 sm:w-48 h-16 sm:h-20 border-b-2 border-x-2 border-pitch-line pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-6 sm:h-8 border-b-2 border-x-2 border-pitch-line pointer-events-none" />
      {/* Top Penalty Arc (D-box) */}
      <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 w-14 sm:w-16 h-6 border-b-2 border-pitch-line rounded-b-full pointer-events-none" />

      {/* Bottom Penalty Area (Our side) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 sm:w-48 h-16 sm:h-20 border-t-2 border-x-2 border-pitch-line pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-6 sm:h-8 border-t-2 border-x-2 border-pitch-line pointer-events-none" />
      {/* Bottom Penalty Arc (D-box) */}
      <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 w-14 sm:w-16 h-6 border-t-2 border-pitch-line rounded-t-full pointer-events-none" />

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

        // For Goalkeeper at bottom (y >= 88%), position label above token on small screens so it never clips past bottom
        const isNearBottom = slot.coordinates.y >= 88;

        return (
          <div
            key={slot.id}
            data-slot-id={slot.id}
            data-highlighted={isHighlighted ? 'true' : 'false'}
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
            {/* If near bottom, place label on top of token on mobile */}
            {isNearBottom && (
              <div
                className={`mb-1 px-1 py-0.5 rounded text-center max-w-[68px] sm:max-w-[95px] truncate transition-all sm:hidden ${
                  isHighlighted
                    ? 'bg-emerald-950 border-2 border-emerald-400 text-emerald-300 shadow-xl font-bold text-[9px] scale-105'
                    : 'bg-tactical-900/90 border border-tactical-700/60 text-tactical-100 text-[9px]'
                }`}
              >
                <span className="truncate block font-semibold">
                  {drafted
                    ? getShortName(drafted.player.name)
                    : isHighlighted
                    ? 'Place Here'
                    : slot.defaultPosition}
                </span>
              </div>
            )}

            {drafted ? (
              // Drafted Player Token
              <div
                className={`relative flex flex-col items-center justify-center w-11 h-11 sm:w-13 sm:h-13 md:w-15 md:h-15 rounded-full border-2 shadow-xl transition-transform ${
                  drafted.player.ovr >= 95
                    ? 'bg-gradient-to-b from-tactical-800 via-amber-950/40 to-tactical-900 border-amber-300 ring-2 ring-amber-400/60 shadow-[0_0_18px_rgba(245,158,11,0.55)]'
                    : drafted.player.ovr >= 90 || drafted.player.hasLegendSeal
                    ? 'bg-gradient-to-b from-tactical-800 to-tactical-900 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-gradient-to-b from-tactical-800 to-tactical-900 border-pitch-accent shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                }`}
              >
                <span className={`font-mono font-black text-xs sm:text-sm leading-tight ${getOvrColorClass(drafted.player.ovr)}`}>
                  {drafted.player.ovr}
                </span>
                <span className="font-mono text-[8px] sm:text-[9px] text-pitch-accent font-bold leading-none uppercase">
                  {drafted.assignedPosition}
                </span>
                {drafted.player.hasLegendSeal && (
                  <Award
                    className={`absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                      drafted.player.ovr >= 95
                        ? 'text-amber-300 fill-amber-300/40 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]'
                        : 'text-gold-400 fill-gold-500/30'
                    }`}
                  />
                )}
              </div>
            ) : (
              // Empty Slot Token
              <div
                className={`flex flex-col items-center justify-center w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full border-2 transition-all duration-300 ${
                  isHighlighted
                    ? 'bg-emerald-500/35 border-emerald-300 ring-4 ring-emerald-400/90 shadow-[0_0_25px_rgba(52,211,153,0.9)] animate-pulse scale-105'
                    : isSelected
                    ? 'bg-pitch-accent/30 border-pitch-accent scale-110 shadow-lg shadow-pitch-accent/40'
                    : 'bg-tactical-950/70 border-tactical-600 hover:border-emerald-400/60 border-dashed backdrop-blur-xs'
                }`}
              >
                <span
                  className={`font-mono font-bold text-[11px] sm:text-xs ${
                    isHighlighted ? 'text-emerald-100 font-extrabold text-xs sm:text-sm' : 'text-tactical-300'
                  }`}
                >
                  {slot.defaultPosition}
                </span>
              </div>
            )}

            {/* Label below token (Standard, hidden on mobile if isNearBottom) */}
            <div
              className={`mt-0.5 sm:mt-1 px-1 sm:px-1.5 py-0.5 rounded text-center max-w-[68px] sm:max-w-[95px] truncate transition-all ${
                isNearBottom ? 'hidden sm:block' : 'block'
              } ${
                isHighlighted
                  ? 'bg-emerald-950 border-2 border-emerald-400 text-emerald-300 shadow-xl font-bold text-[9px] sm:text-[10px] scale-105'
                  : 'bg-tactical-900/90 border border-tactical-700/60 text-tactical-100 text-[9px] sm:text-[10px]'
              }`}
            >
              <span className="truncate block font-medium">
                {drafted
                  ? <span className="hidden sm:inline">{drafted.player.name}</span>
                  : null}
                {drafted
                  ? <span className="sm:hidden font-semibold">{getShortName(drafted.player.name)}</span>
                  : isHighlighted
                  ? 'Place Here'
                  : <span className="hidden sm:inline">{slot.name}</span>}
                {!drafted && !isHighlighted ? (
                  <span className="sm:hidden font-mono font-bold text-[10px] text-tactical-300">{slot.defaultPosition}</span>
                ) : null}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

