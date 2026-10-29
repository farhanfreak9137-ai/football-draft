import React, { useRef, useEffect } from 'react';
import { FormationSlot, PlayerVersion, TeamEdition } from '../../shared/types/index.js';
import { isPlayerEligibleForSlot } from '../../shared/constants/formations.js';
import { PlayerCard } from './PlayerCard.js';
import { RefreshCw, Dice5, Clock } from 'lucide-react';
import { messages } from '../i18n/messages.js';
import { CATEGORY_ORDER, getPlayerCategory } from '../utils/positionCategory.js';

interface RosterListProps {
  edition: TeamEdition | null;
  roster: PlayerVersion[];
  openSlots: FormationSlot[];
  draftedPlayerIds: string[];
  opponentDraftedPlayerIds?: string[];
  rerollsRemaining: number;
  isMyTurn: boolean;
  selectedPlayerId?: string | null;
  onSelectPlayer: (player: PlayerVersion) => void;
  onSlotSelect?: (slotId: string) => void;
  onReroll: () => void;
  onRoll?: () => void;
  isRolling?: boolean;
  disabled?: boolean;
}

export const RosterList: React.FC<RosterListProps> = ({
  edition,
  roster,
  openSlots,
  draftedPlayerIds,
  opponentDraftedPlayerIds = [],
  rerollsRemaining,
  isMyTurn,
  selectedPlayerId,
  onSelectPlayer,
  onSlotSelect,
  onReroll,
  onRoll,
  isRolling = false,
  disabled = false,
}) => {
  if (!edition) {
    if (isMyTurn) {
      return (
        <div className="bg-gradient-to-b from-tactical-850 via-tactical-900 to-pitch-night border-2 border-emerald-500/35 rounded-2xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 to-transparent pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/25 to-tactical-800 border-2 border-emerald-400/60 flex items-center justify-center mx-auto text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
            <Dice5 className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-xl font-black text-tactical-100 tracking-tight font-display uppercase">
              Draw Your Historical Squad
            </h3>
            <p className="text-xs text-tactical-300 leading-relaxed">
              Randomly roll an authoritative World Cup or Club season edition. 22 unique players rule enforced across the pitch.
            </p>
          </div>

          <div className="pt-1">
            <button
              onClick={onRoll}
              disabled={disabled || isRolling}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-tactical-950 font-black text-sm border border-emerald-300/80 shadow-[0_0_25px_rgba(16,185,129,0.45)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              <Dice5 className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
              <span>{isRolling ? 'Drawing Squad...' : 'Roll Team Edition'}</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-tactical-400 flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Free initial draw • 3 tactical rerolls available</span>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-tactical-850/95 border border-tactical-700/80 rounded-2xl p-8 text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 rounded-full bg-tactical-800 border border-tactical-700 flex items-center justify-center mx-auto text-tactical-400">
          <Clock className="w-6 h-6 animate-pulse text-amber-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-tactical-200">
            Waiting for Opponent to Roll
          </h3>
          <p className="text-xs text-tactical-400">
            Opponent's turn to roll their historical team edition...
          </p>
        </div>
      </div>
    );
  }

  // Pre-calculate eligibility for each player in the edition
  const playerEligibility = roster.map((player) => {
    // 1. Identity uniqueness in user's own team
    const alreadyDrafted = draftedPlayerIds.includes(player.identityId);
    if (alreadyDrafted) {
      return {
        player,
        eligible: false,
        reason: messages.draft.alreadyDrafted,
        isTakenByOpponent: false,
      };
    }

    // 2. Identity uniqueness across the match (22 unique players rule)
    const takenByOpponent = opponentDraftedPlayerIds.includes(player.identityId);
    if (takenByOpponent) {
      return {
        player,
        eligible: false,
        reason: messages.draft.alreadyDraftedByOpponent,
        isTakenByOpponent: true,
      };
    }

    // 3. Open slot compatibility using authoritative slot matching
    const matchingSlots = openSlots.filter((slot) => isPlayerEligibleForSlot(player, slot));

    if (matchingSlots.length === 0) {
      return {
        player,
        eligible: false,
        reason: messages.draft.positionIncompatible,
        isTakenByOpponent: false,
      };
    }

    return {
      player,
      eligible: true,
      reason: undefined,
      isTakenByOpponent: false,
      matchingSlots,
    };
  });

  // Group players by position category: Goalkeepers, Defenders, Midfielders, Attackers
  const groupedPlayers = CATEGORY_ORDER.map((cat) => {
    const items = playerEligibility.filter(
      (item) => getPlayerCategory(item.player) === cat.id
    );
    return {
      ...cat,
      items,
    };
  }).filter((group) => group.items.length > 0);

  const [density, setDensity] = React.useState<'compact' | 'comfortable'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('football_sim_roster_density') as 'compact' | 'comfortable') || 'compact';
    }
    return 'compact';
  });

  const handleToggleDensity = (mode: 'compact' | 'comfortable') => {
    setDensity(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('football_sim_roster_density', mode);
    }
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastEditionId = useRef<string | null>(null);

  const scrollToCategory = (catId: string) => {
    const el = document.getElementById(`cat-group-${catId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Auto-scroll to first category with eligible players when turn starts or edition rolls
  useEffect(() => {
    if (!edition || !isMyTurn) return;
    const currentKey = `${edition.id || edition.teamName}-${draftedPlayerIds.length}`;
    if (lastEditionId.current !== currentKey) {
      lastEditionId.current = currentKey;
      const firstEligibleGroup = groupedPlayers.find((g) => g.items.some((i) => i.eligible));
      if (firstEligibleGroup && firstEligibleGroup.id !== groupedPlayers[0]?.id) {
        const timer = setTimeout(() => {
          scrollToCategory(firstEligibleGroup.id);
        }, 120);
        return () => clearTimeout(timer);
      }
    }
  }, [edition?.id, edition?.teamName, isMyTurn, draftedPlayerIds.length]);

  // Auto-scroll selected player and 1-Tap assign buttons into clear view
  useEffect(() => {
    if (selectedPlayerId) {
      const el = document.getElementById(`player-card-${selectedPlayerId}`);
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 60);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedPlayerId]);

  return (
    <div className="bg-tactical-850/95 border border-tactical-700/80 rounded-2xl p-3 sm:p-4 space-y-2.5 shadow-xl">
      {/* Sleek Edition Header Bar */}
      <div className="flex items-center justify-between border-b border-tactical-700/80 pb-2.5">
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <h3 className="text-sm sm:text-base font-extrabold text-tactical-100 truncate tracking-tight">
              {edition.teamName}{' '}
              <span className="text-amber-400 font-mono font-bold">({edition.yearOrSeason})</span>
            </h3>
            <span className="text-[9px] sm:text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-tactical-800 text-amber-300/90 border border-amber-500/30">
              {edition.achievement || 'World Cup'}
            </span>
          </div>
        </div>

        {/* Header Actions: Density Toggle + Reroll Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center p-0.5 bg-tactical-900 rounded-lg border border-tactical-750 text-[10px] font-mono select-none">
            <button
              type="button"
              onClick={() => handleToggleDensity('compact')}
              title="Compact multi-column view to fit squad on screen"
              className={`px-2 py-1 rounded transition-all flex items-center gap-1 ${
                density === 'compact'
                  ? 'bg-tactical-750 text-gold-400 font-bold shadow-xs'
                  : 'text-tactical-500 hover:text-tactical-300'
              }`}
            >
              <span>🗜️ Fit</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleDensity('comfortable')}
              title="Comfortable 2-column view"
              className={`px-2 py-1 rounded transition-all flex items-center gap-1 ${
                density === 'comfortable'
                  ? 'bg-tactical-750 text-tactical-100 font-bold shadow-xs'
                  : 'text-tactical-500 hover:text-tactical-300'
              }`}
            >
              <span>▦ List</span>
            </button>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onReroll();
            }}
            disabled={!isMyTurn || rerollsRemaining <= 0 || disabled || isRolling}
            title={
              rerollsRemaining <= 0
                ? 'No tactical rerolls remaining (limit 3 per draft)'
                : !isMyTurn
                ? 'Wait for your turn'
                : 'Reroll for another historical squad (consumes 1 reroll)'
            }
            className={`flex items-center gap-1.5 px-2.5 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              isMyTurn && rerollsRemaining > 0 && !disabled && !isRolling
                ? 'bg-tactical-750 hover:bg-tactical-700 text-gold-400 border border-gold-500/50 hover:border-gold-400 active:scale-95 cursor-pointer ring-1 ring-gold-500/20'
                : 'bg-tactical-800 text-tactical-600 border border-tactical-750 cursor-not-allowed opacity-50'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRolling ? 'animate-spin text-pitch-accent' : ''}`} />
            <span>{isRolling ? 'Rerolling...' : 'Reroll'}</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 bg-tactical-900 rounded border border-tactical-750 text-tactical-300">
              {rerollsRemaining}/3
            </span>
          </button>
        </div>
      </div>

      {/* Quick Category Jump Bar with Auto-Scroll navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar select-none">
        {groupedPlayers.map((cat) => {
          const eligibleCount = cat.items.filter((i) => i.eligible).length;
          const isNeeded = eligibleCount > 0;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => scrollToCategory(cat.id)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold shrink-0 transition-all flex items-center gap-1 border active:scale-95 ${
                isNeeded
                  ? 'bg-tactical-800 hover:bg-tactical-750 text-tactical-100 border-tactical-600 shadow-xs'
                  : 'bg-tactical-900/60 text-tactical-500 border-tactical-800 opacity-60'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                  isNeeded
                    ? 'bg-pitch-DEFAULT/30 text-pitch-accent border border-pitch-line/40'
                    : 'bg-tactical-800 text-tactical-500'
                }`}
              >
                {eligibleCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Categorized Roster List (Smooth natural scrolling with responsive density) */}
      <div
        ref={scrollContainerRef}
        className={`${
          density === 'compact' ? 'space-y-1.5 sm:space-y-2' : 'space-y-3'
        } max-h-[72vh] sm:max-h-[640px] overflow-y-auto smooth-scroll pr-1 pb-3`}
      >
        {groupedPlayers.map((group) => (
          <div key={group.id} id={`cat-group-${group.id}`} className="space-y-1 scroll-mt-2">
            {/* Minimalist Section Header */}
            <div className="sticky top-0 z-10 bg-tactical-850/95 backdrop-blur-sm py-0.5 border-b border-tactical-700/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-tactical-200 uppercase tracking-wide">
                <span>{group.icon}</span>
                <span>{group.label}</span>
              </div>
              <span className="font-mono text-[9px] text-tactical-400 bg-tactical-800 px-1 py-0.2 rounded border border-tactical-700/60">
                {group.items.length}
              </span>
            </div>

            {/* Players Grid: 2 columns on mobile, 3 columns on tablet/desktop in compact mode */}
            <div
              className={`grid ${
                density === 'compact'
                  ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-1'
                  : 'grid-cols-1 sm:grid-cols-2 gap-1.5'
              }`}
            >
              {group.items.map(({ player, eligible, reason, isTakenByOpponent, matchingSlots }) => {
                const isSelected = selectedPlayerId === player.id;
                return (
                  <div key={player.id} id={`player-card-${player.id}`} className="flex flex-col scroll-mt-4">
                    <PlayerCard
                      player={player}
                      eligible={eligible}
                      isSelected={isSelected}
                      ineligibleReason={reason}
                      isTakenByOpponent={isTakenByOpponent}
                      isCompact={density === 'compact'}
                      disabled={!isMyTurn || disabled}
                      onPick={eligible && isMyTurn ? () => onSelectPlayer(player) : undefined}
                    />
                    {isSelected && isMyTurn && matchingSlots && matchingSlots.length > 0 && (
                      <div className="bg-emerald-950/95 border-x border-b border-emerald-400 rounded-b p-1.5 flex flex-col gap-1 shadow-xl animate-in fade-in duration-150 z-20">
                        <div className="flex items-center justify-between text-[10px] text-emerald-200 font-semibold">
                          <span>Assign <strong>{player.name}</strong> to:</span>
                          <span className="text-[9px] text-emerald-400 font-mono font-bold bg-emerald-900/60 px-1 py-0.2 rounded border border-emerald-500/40">1-Tap Assign</span>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          {matchingSlots.map((slot) => (
                            <button
                              key={slot.id}
                              data-testid="quick-assign-btn"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onSlotSelect) onSlotSelect(slot.id);
                              }}
                              className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-tactical-950 font-black text-[11px] shadow-sm transition-all cursor-pointer"
                            >
                              <span>{slot.defaultPosition}</span>
                              <span className="text-[9px] font-medium opacity-90">({slot.name})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
