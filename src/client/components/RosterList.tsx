import React, { useRef, useEffect } from 'react';
import { FormationSlot, PlayerVersion, TeamEdition } from '../../shared/types/index.js';
import { isPlayerEligibleForSlot } from '../../shared/constants/formations.js';
import { PlayerCard } from './PlayerCard.js';
import { RefreshCw, Info, Dice5, Clock, Sparkles } from 'lucide-react';
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
        <div className="bg-tactical-850 border border-tactical-700/80 rounded-xl p-8 text-center space-y-5 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pitch-DEFAULT/30 to-tactical-800 border-2 border-pitch-line/80 flex items-center justify-center mx-auto text-pitch-accent shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            <Dice5 className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-lg font-black text-tactical-100 tracking-tight">
              Roll Your Team Edition
            </h3>
            <p className="text-xs text-tactical-400 leading-relaxed">
              Click below to randomly draw a historical World Cup squad. 22 unique players rule enforced across the pitch.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onRoll}
              disabled={disabled || isRolling}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-pitch-DEFAULT hover:bg-pitch-light active:scale-95 text-tactical-100 font-extrabold text-sm border-2 border-pitch-line shadow-[0_0_25px_rgba(34,197,94,0.35)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Dice5 className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
              <span>{isRolling ? 'Drawing Squad...' : 'Roll Team Edition'}</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-tactical-500">
            Initial roll is free • 3 tactical rerolls available per draft
          </div>
        </div>
      );
    }

    return (
      <div className="bg-tactical-850 border border-tactical-700/80 rounded-xl p-8 text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 rounded-full bg-tactical-800 border border-tactical-700 flex items-center justify-center mx-auto text-tactical-400">
          <Clock className="w-6 h-6 animate-pulse" />
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
    <div className="bg-tactical-850 border border-tactical-700/60 rounded-lg p-3 space-y-2.5 shadow-lg">
      {/* Minimalist Header bar */}
      <div className="flex items-center justify-between border-b border-tactical-700/70 pb-2">
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-tactical-100 truncate">
              {edition.teamName}{' '}
              <span className="text-gold-400 font-mono">({edition.yearOrSeason})</span>
            </h3>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-tactical-750 text-tactical-400 border border-tactical-700">
              {edition.achievement || 'World Cup'}
            </span>
          </div>
        </div>

        {/* Minimalist Reroll Button */}
        <div className="flex items-center gap-2 shrink-0">
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              isMyTurn && rerollsRemaining > 0 && !disabled && !isRolling
                ? 'bg-tactical-750 hover:bg-tactical-700 text-gold-400 border border-gold-500/50 hover:border-gold-400 active:scale-95 cursor-pointer ring-1 ring-gold-500/20'
                : 'bg-tactical-800 text-tactical-600 border border-tactical-750 cursor-not-allowed opacity-50'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRolling ? 'animate-spin text-pitch-accent' : ''}`} />
            <span>{isRolling ? 'Rerolling...' : 'Reroll'}</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 bg-tactical-900 rounded border border-tactical-750 text-tactical-300">
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
              className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 border active:scale-95 ${
                isNeeded
                  ? 'bg-tactical-800 hover:bg-tactical-750 text-tactical-100 border-tactical-600 shadow-xs'
                  : 'bg-tactical-900/60 text-tactical-500 border-tactical-800 opacity-60'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
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

      {/* Categorized Roster List (Smooth natural mobile scrolling with section jump anchors) */}
      <div
        ref={scrollContainerRef}
        className="space-y-3.5 max-h-[68vh] sm:max-h-[600px] overflow-y-auto smooth-scroll pr-1 pb-4"
      >
        {groupedPlayers.map((group) => (
          <div key={group.id} id={`cat-group-${group.id}`} className="space-y-1.5 scroll-mt-2">
            {/* Minimalist Section Header */}
            <div className="sticky top-0 z-10 bg-tactical-850/95 backdrop-blur-sm py-1 border-b border-tactical-700/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-tactical-200 uppercase tracking-wide">
                <span>{group.icon}</span>
                <span>{group.label}</span>
              </div>
              <span className="font-mono text-[10px] text-tactical-400 bg-tactical-800 px-1.5 py-0.5 rounded border border-tactical-700/60">
                {group.items.length}
              </span>
            </div>

            {/* Players Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
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
                      disabled={!isMyTurn || disabled}
                      onPick={eligible && isMyTurn ? () => onSelectPlayer(player) : undefined}
                    />
                    {isSelected && isMyTurn && matchingSlots && matchingSlots.length > 0 && (
                      <div className="bg-emerald-950/95 border-x border-b border-emerald-400 rounded-b p-2 flex flex-col gap-1.5 shadow-xl animate-in fade-in duration-150 z-20">
                        <div className="flex items-center justify-between text-[11px] text-emerald-200 font-semibold">
                          <span>Assign <strong>{player.name}</strong> to:</span>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-500/40">1-Tap Assign</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {matchingSlots.map((slot) => (
                            <button
                              key={slot.id}
                              data-testid="quick-assign-btn"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onSlotSelect) onSlotSelect(slot.id);
                              }}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-tactical-950 font-black text-xs shadow-md transition-all cursor-pointer"
                            >
                              <span>{slot.defaultPosition}</span>
                              <span className="text-[10px] font-medium opacity-90">({slot.name})</span>
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
