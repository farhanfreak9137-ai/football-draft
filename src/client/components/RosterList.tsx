import React from 'react';
import { FormationSlot, PlayerVersion, TeamEdition } from '../../shared/types/index.js';
import { isPlayerEligibleForSlot } from '../../shared/constants/formations.js';
import { PlayerCard } from './PlayerCard.js';
import { RefreshCw, Info, Dice5, Clock, Sparkles } from 'lucide-react';
import { messages } from '../i18n/messages.js';

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
    };
  });

  return (
    <div className="bg-tactical-850 border border-tactical-700/60 rounded-lg p-3 space-y-2.5">
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
            onClick={onReroll}
            disabled={!isMyTurn || rerollsRemaining <= 0 || disabled}
            title={rerollsRemaining <= 0 ? 'No rerolls remaining' : 'Roll another historical team'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              isMyTurn && rerollsRemaining > 0 && !disabled
                ? 'bg-tactical-750 hover:bg-tactical-700 text-tactical-200 border border-tactical-600 active:scale-95'
                : 'bg-tactical-800 text-tactical-600 border border-tactical-750 cursor-not-allowed opacity-50'
            }`}
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reroll</span>
            <span className="font-mono text-[10px] px-1 py-0.5 bg-tactical-900 rounded text-tactical-400">
              {rerollsRemaining}
            </span>
          </button>
        </div>
      </div>

      {/* Minimalist Roster List (2 columns on sm+, single column on mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[560px] overflow-y-auto pr-1">
        {playerEligibility.map(({ player, eligible, reason, isTakenByOpponent }) => (
          <PlayerCard
            key={player.id}
            player={player}
            eligible={eligible}
            isSelected={selectedPlayerId === player.id}
            ineligibleReason={reason}
            isTakenByOpponent={isTakenByOpponent}
            disabled={!isMyTurn || disabled}
            onPick={eligible && isMyTurn ? () => onSelectPlayer(player) : undefined}
          />
        ))}
      </div>
    </div>
  );
};
